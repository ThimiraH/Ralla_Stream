// "use client";

// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { toast } from "react-hot-toast";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { TrashIcon } from "@heroicons/react/24/outline"; // Delete Icon

// export default function DiscussionSection({ movieId }) {
//   const { data: session } = useSession();
//   const router = useRouter();

//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");
//   const [replyText, setReplyText] = useState("");
//   const [activeReplyId, setActiveReplyId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(true);

//   useEffect(() => {
//     const fetchComments = async () => {
//       try {
//         const res = await fetch(`/api/comments?movieId=${movieId}`);
//         const data = await res.json();
//         setComments(data);
//       } catch (error) {
//         console.error("Error loading comments", error);
//       } finally {
//         setFetching(false);
//       }
//     };
//     if (movieId) fetchComments();
//   }, [movieId]);

//   const handleSubmit = async (e, parentId = null) => {
//     e.preventDefault();
//     if (!session) { toast.error("Please login"); return; }

//     const textToSend = parentId ? replyText : newComment;
//     if (!textToSend.trim()) return;

//     setLoading(true);
//     try {
//       const res = await fetch("/api/comments", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ movieId, text: textToSend, parentId }),
//       });
//       const savedComment = await res.json();
//       if (res.ok) {
//         setComments([savedComment, ...comments]);
//         if (parentId) {
//           setReplyText(""); setActiveReplyId(null); toast.success("Reply posted!");
//         } else {
//           setNewComment(""); toast.success("Comment posted!");
//         }
//       }
//     } catch (error) { toast.error("Error posting"); } finally { setLoading(false); }
//   };

//   // Delete Function
//   const handleDelete = async (commentId) => {
//     if (!confirm("Delete this comment?")) return;
//     try {
//       const res = await fetch(`/api/comments?id=${commentId}`, { method: "DELETE" });
//       if (res.ok) {
//         setComments(comments.filter(c => c._id !== commentId)); // Remove locally
//         toast.success("Deleted");
//       } else {
//         toast.error("Failed to delete");
//       }
//     } catch (error) { toast.error("Error"); }
//   };

//   const rootComments = comments.filter(c => !c.parentId);
//   const getReplies = (commentId) => comments.filter(c => c.parentId === commentId).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

//   // YouTube Style Comment Item Component
//   const CommentItem = ({ comment, isReply = false }) => {

//     // ID Check එක variable එකකට ගත්තා debugging වලට ලේසි වෙන්න
//     // session.user.id (NextAuth default) හෝ session.user._id (MongoDB standard) දෙකම check කරනවා
//     const isOwner = session?.user && (
//       session.user.id === comment.userId?._id ||
//       session.user._id === comment.userId?._id ||
//       session.user.email === comment.userId?.email // ID අවුල් නම් Email එකෙන් හරි අල්ලන්න
//     );

//     return (
//       <div className={`flex gap-3 mb-4 ${isReply ? "ml-12" : ""}`}>
//         {/* Avatar */}
//         <div className={`${isReply ? "w-6 h-6" : "w-10 h-10"} rounded-full overflow-hidden bg-gray-700 shrink-0`}>
//           {comment.userId?.image ? (
//             <Image src={comment.userId.image} alt="User" width={40} height={40} className="object-cover" />
//           ) : (
//             <div className="w-full h-full flex items-center justify-center font-bold text-white bg-blue-600 text-xs">
//               {comment.userId?.name?.charAt(0)}
//             </div>
//           )}
//         </div>

//         {/* Content */}
//         <div className="flex-1">
//           <div className="flex items-center gap-2 mb-1">
//             <span className={`text-white font-semibold ${isReply ? "text-xs" : "text-sm"}`}>
//               {comment.userId?.name || "User"}
//             </span>
//             <span className="text-gray-500 text-[11px]">
//               {new Date(comment.createdAt).toLocaleDateString()}
//             </span>
//           </div>

//           <p className={`text-gray-200 leading-relaxed ${isReply ? "text-sm" : "text-[15px]"}`}>
//             {comment.text}
//           </p>

//           {/* Actions (Reply / Delete) */}
//           <div className="flex items-center gap-4 mt-2">
//             <button
//               onClick={() => handleReplyClick(comment)}
//               className="text-gray-400 hover:text-white text-xs font-bold uppercase"
//             >
//               Reply
//             </button>

//             {/* Delete Button (Only for owner) */}
//             {isOwner && (
//               <button
//                 onClick={() => handleDelete(comment._id)}
//                 className="text-gray-500 hover:text-red-500 transition flex items-center gap-1 group"
//                 title="Delete Comment"
//               >
//                 <TrashIcon className="w-4 h-4 group-hover:scale-110 transition" />
//               </button>
//             )}
//           </div>

//           {/* Reply Input */}
//           {activeReplyId === comment._id && (
//             <form onSubmit={(e) => handleSubmit(e, comment._id)} className="mt-3 flex gap-2 animate-fade-in">
//               <input
//                 type="text"
//                 placeholder="Add a reply..."
//                 className="flex-1 bg-transparent border-b border-gray-600 px-0 py-1 text-sm text-white focus:border-blue-500 outline-none transition-colors"
//                 value={replyText}
//                 onChange={(e) => setReplyText(e.target.value)}
//                 autoFocus
//               />
//               <div className="flex gap-2">
//                 <button type="button" onClick={() => setActiveReplyId(null)} className="text-gray-400 text-xs font-bold px-3 py-2 hover:bg-gray-800 rounded-full">Cancel</button>
//                 <button type="submit" disabled={loading} className="bg-blue-600 text-black text-xs font-bold px-3 py-2 rounded-full hover:bg-blue-500">Reply</button>
//               </div>
//             </form>
//           )}
//         </div>
//       </div>
//     );
//   }


//   const handleReplyClick = (comment) => {
//     setActiveReplyId(activeReplyId === comment._id ? null : comment._id);

//     // Reply බට්න් එක එබුවම නම @tag එකක් විදිහට වැටෙන්න හදමු
//     if (activeReplyId !== comment._id) {
//       // නම එකතු කරන්න (@Name )
//       setReplyText(`@${comment.userId?.name || "User"} `);
//     } else {
//       setReplyText("");
//     }
//   };

//   return (
//     <div className="max-w-[1200px] mt-8">
//       <h3 className="text-xl font-bold mb-6 text-white">{comments.length} Comments</h3>

//       {/* Main Input */}
//       <div className="flex gap-4 mb-8">
//         <div className="w-10 h-10 rounded-full bg-gray-700 shrink-0 overflow-hidden">
//           {/* {session?.user?.image && <Image src={session.user.image} width={40} height={40} alt="Me" />} */}
//           {session?.user?.image ? (
//             <Image src={comment.userId.image} alt="User" width={40} height={40} className="object-cover" />
//           ) : (
//             <div className="w-full h-full flex items-center justify-center font-bold text-white bg-blue-600 text-xs">
//               {session?.user?.name?.charAt(0)}
//             </div>
//           )}
//         </div>
//         <form onSubmit={(e) => handleSubmit(e, null)} className="flex-1">
//           <input
//             type="text"
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//             placeholder="Add a comment..."
//             className="w-full bg-transparent border-b border-gray-700 pb-2 text-white focus:outline-none focus:border-white transition-colors"
//             onFocus={(e) => e.target.parentElement.classList.add("focused")}
//           />
//           <div className="flex justify-end mt-3 gap-2">
//             <button type="button" onClick={() => setNewComment("")} className="text-white text-sm font-bold px-4 py-2 hover:bg-gray-800 rounded-full">Cancel</button>
//             <button type="submit" disabled={!newComment.trim()} className="bg-[#3ea6ff] text-black text-sm font-bold px-4 py-2 rounded-full hover:bg-[#65b8ff] disabled:bg-gray-700 disabled:text-gray-500">
//               Comment
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Comments List */}
//       <div className="space-y-2">
//         {fetching ? <p className="text-gray-500">Loading...</p> : rootComments.map((comment) => (
//           <div key={comment._id}>
//             <CommentItem comment={comment} />
//             {/* Render Replies */}
//             {getReplies(comment._id).map(reply => (
//               <CommentItem key={reply._id} comment={reply} isReply={true} />
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function DiscussionSection({ movieId, season, episode }) {
    const { data: session } = useSession();

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [replyText, setReplyText] = useState("");
    const [activeReplyId, setActiveReplyId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                setFetching(true); // Loading පෙන්නන්න
                // 👇 URL එකට season සහ episode එකතු කළා
                let url = `/api/comments?movieId=${movieId}`;
                if (season && episode) {
                    url += `&season=${season}&episode=${episode}`;
                }

                const res = await fetch(url);
                const data = await res.json();
                setComments(data);
            } catch (error) {
                console.error("Error loading comments", error);
            } finally {
                setFetching(false);
            }
        };
        if (movieId) fetchComments();
    }, [movieId, season, episode]);

    const handleSubmit = async (e, parentId = null) => {
        e.preventDefault();
        if (!session) { toast.error("Please login"); return; }

        const textToSend = parentId ? replyText : newComment;
        if (!textToSend.trim()) return;

        setLoading(true);
        try {
            const res = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ movieId, text: textToSend, parentId, season, episode }),
            });
            const savedComment = await res.json();
            if (res.ok) {
                setComments([savedComment, ...comments]);
                if (parentId) {
                    setReplyText(""); setActiveReplyId(null); toast.success("Reply posted!");
                } else {
                    setNewComment(""); toast.success("Comment posted!");
                }
            }
        } catch (error) { toast.error("Error posting"); } finally { setLoading(false); }
    };

    const handleDelete = async (commentId) => {
        if (!confirm("Delete this comment?")) return;
        try {
            const res = await fetch(`/api/comments?id=${commentId}`, { method: "DELETE" });
            if (res.ok) {
                setComments(comments.filter(c => c._id !== commentId));
                toast.success("Deleted");
            } else {
                toast.error("Failed to delete");
            }
        } catch (error) { toast.error("Error"); }
    };

    const handleReplyClick = (comment) => {
        setActiveReplyId(activeReplyId === comment._id ? null : comment._id);
        if (activeReplyId !== comment._id) {
            // User කෙනෙක් නැත්නම් "User" කියලා ගන්න
            const name = comment.userId?.name || "User";
            setReplyText(`@${name} `);
        } else {
            setReplyText("");
        }
    };

    const rootComments = comments.filter(c => !c.parentId);
    const getReplies = (commentId) => comments.filter(c => c.parentId === commentId).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // 👇 CommentItem Component (Updated with Safety Checks)
    const CommentItem = ({ comment, isReply = false }) => {

        // 👇 FIX: User කෙනෙක් නැත්නම් (Deleted User), හිස් වටිනාකම් දාගන්නවා Error එන එක නවත්වන්න
        const user = comment.userId || { name: "Deleted User", image: null, _id: null };

        const isOwner = session?.user && (
            session.user.id === user._id ||
            session.user._id === user._id ||
            session.user.email === user.email
        );

        return (
            <div className={`flex gap-3 mb-4 ${isReply ? "ml-12" : ""}`}>
                {/* Avatar */}
                <div className={`${isReply ? "w-6 h-6" : "w-10 h-10"} rounded-full overflow-hidden bg-gray-700 shrink-0`}>
                    {user.image ? (
                        <Image src={user.image} alt="User" width={40} height={40} className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-white bg-blue-600 text-xs">
                            {user.name ? user.name.charAt(0) : "?"}
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-white font-semibold ${isReply ? "text-xs" : "text-sm"}`}>
                            {user.name}
                        </span>
                        <span className="text-gray-500 text-[11px]">
                            {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    <p className={`text-gray-200 leading-relaxed ${isReply ? "text-sm" : "text-[15px]"}`}>
                        {comment.text}
                    </p>

                    <div className="flex items-center gap-4 mt-2">
                        <button
                            onClick={() => handleReplyClick(comment)}
                            className="text-gray-400 hover:text-white text-xs font-bold uppercase"
                        >
                            Reply
                        </button>

                        {isOwner && (
                            <button onClick={() => handleDelete(comment._id)} className="text-gray-500 hover:text-red-500 transition">
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {activeReplyId === comment._id && (
                        <form onSubmit={(e) => handleSubmit(e, comment._id)} className="mt-3 flex gap-2 animate-fade-in">
                            <input
                                type="text"
                                placeholder="Add a reply..."
                                className="flex-1 bg-transparent border-b border-gray-600 px-0 py-1 text-sm text-white focus:border-blue-500 outline-none transition-colors"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setActiveReplyId(null)} className="text-gray-400 text-xs font-bold px-3 py-2 hover:bg-gray-800 rounded-full">Cancel</button>
                                <button type="submit" disabled={loading} className="bg-blue-600 text-black text-xs font-bold px-3 py-2 rounded-full hover:bg-blue-500">Reply</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-[1200px] mt-8">
            <h3 className="text-xl font-bold mb-6 text-white">{comments.length} Comments</h3>

            {/* Main Input Box */}
            <div className="flex gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-gray-700 shrink-0 overflow-hidden">
                    {/* Session Image Check */}
                    {session?.user?.image && <Image src={session.user.image} width={40} height={40} alt="Me" />}
                </div>
                <form onSubmit={(e) => handleSubmit(e, null)} className="flex-1">
                    <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." className="w-full bg-transparent border-b border-gray-700 pb-2 text-white focus:outline-none focus:border-white transition-colors" />
                    <div className="flex justify-end mt-3 gap-2">
                        <button type="button" onClick={() => setNewComment("")} className="text-white text-sm font-bold px-4 py-2 hover:bg-gray-800 rounded-full">Cancel</button>
                        <button type="submit" disabled={!newComment.trim()} className="bg-[#3ea6ff] text-black text-sm font-bold px-4 py-2 rounded-full hover:bg-[#65b8ff] disabled:bg-gray-700 disabled:text-gray-500">Comment</button>
                    </div>
                </form>
            </div>

            <div className="space-y-2">
                {fetching ? <p className="text-gray-500">Loading...</p> : rootComments.map((comment) => (
                    <div key={comment._id}>
                        <CommentItem comment={comment} />
                        {getReplies(comment._id).map(reply => (
                            <CommentItem key={reply._id} comment={reply} isReply={true} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}