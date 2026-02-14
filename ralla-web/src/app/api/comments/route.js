import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Comment from "@/models/Comment";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Notification from "@/models/Notification";

// 1. කමෙන්ට් ගන්න (GET) - මේක වෙනස් වෙලා නෑ (Updated for Filtering)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get("movieId");
  const season = searchParams.get("season");
  const episode = searchParams.get("episode");

  if (!movieId) {
    return NextResponse.json({ message: "Movie ID required" }, { status: 400 });
  }

  await connectToDatabase();

  try {
    // 👇 වෙනස් කළ කොටස: Query එක Dynamic කළා
    let query = { movieId };

    // Season සහ Episode තියෙනවා නම් ඒකට අදාළව ෆිල්ටර් කරනවා
    if (season && episode && season !== "undefined" && episode !== "undefined") {
        query.season = parseInt(season);
        query.episode = parseInt(episode);
    }
    // ---------------------------------------------------

    const comments = await Comment.find(query)
      .populate("userId", "name image") 
      .sort({ createdAt: -1 });

    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching comments" }, { status: 500 });
  }

}

// 2. අලුත් කමෙන්ට් හෝ Reply එකක් දාන්න (POST(Notification Logic එක්ක))
export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // මෙන්න මෙතන තමයි අපි parentId එකත් ගන්නේ (👇 season, episode එකතු කළා)
  const { movieId, text, parentId, season, episode } = await request.json();

  if (!text || !text.trim()) {
    return NextResponse.json({ message: "Comment cannot be empty" }, { status: 400 });
  }

  await connectToDatabase();

  try {
    // User ID එක හොයාගන්නවා Email එකෙන්
    const user = await User.findOne({ email: session.user.email });

    let finalParentId = parentId; // Database එකේ Save වෙන Parent ID එක
    let notificationRecipientId = null; // Notification යන්න ඕන කෙනාගේ ID එක

    // Logic: Reply එකක් නම්
    if (parentId) {
      const directParentComment = await Comment.findById(parentId);

      if (directParentComment) {
        notificationRecipientId = directParentComment.userId; // කෙලින්ම Reply කරපු කෙනාට Note එක යවනවා

        // වැදගත්ම කොටස: මේක Reply එකකට Reply එකක් නම් (Nested),
        // අපි ඒක Main Comment එකේ Reply එකක් විදිහට හරවනවා.
        if (directParentComment.parentId) {
          finalParentId = directParentComment.parentId;
        }
      }
    }

    const newComment = await Comment.create({
      userId: user._id,
      movieId,
      text,
      parentId: finalParentId || null, // Parent ID එක තියෙනවා නම් දානවා (Reply), නැත්නම් null
      // 👇 වෙනස් කළ කොටස: Season සහ Episode Save කරනවා
      season: season ? parseInt(season) : undefined,
      episode: episode ? parseInt(episode) : undefined,
    });

    // --- Notification Logic START ---
    if (parentId) {
      const parentComment = await Comment.findById(parentId);

      // තමන් තමන්ටම Reply කරගත්තොත් Notification යවන්න ඕන නෑ
      if (parentComment && parentComment.userId.toString() !== user._id.toString()) {
        await Notification.create({
          recipient: notificationRecipientId, // හරියටම අදාළ කෙනාට
          sender: user._id, // Reply කරපු කෙනා
          movieId: movieId,
          text: `replied to your comment: "${text.substring(0, 20)}..."`
        });
      }
    }
    // --- Notification Logic END -

    // ආපහු යවනකොට යූසර්ගේ විස්තරත් එක්කම යවනවා (UI එකට ලේසි වෙන්න)
    const populatedComment = await Comment.findById(newComment._id).populate("userId", "name image");

    return NextResponse.json(populatedComment);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error posting comment" }, { status: 500 });
  }
}

// 3. DELETE Comment 
export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const commentId = searchParams.get("id");

  await connectToDatabase();

  try {
    const user = await User.findOne({ email: session.user.email });
    const comment = await Comment.findById(commentId);

    if (!comment) return NextResponse.json({ message: "Not found" }, { status: 404 });

    // Comment එක අයිති මේ User ට ද කියලා check කරනවා
    if (comment.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Comment එක සහ ඊට අදාල replies මකනවා (Optional: Replies තියාගන්නත් පුළුවන්)
    await Comment.deleteOne({ _id: commentId });
    // Parent මකද්දී Replies ත් මකනවා නම්: await Comment.deleteMany({ parentId: commentId });

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}