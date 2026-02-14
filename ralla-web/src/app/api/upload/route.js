import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export async function POST(request) {
  try {
    const { fileName, fileType } = await request.json();

    // ෆයිල් එකේ නම අලුත් කරනවා (එකම නමින් ෆයිල් ආවොත් Replace නොවෙන්න)
    const uniqueFileName = `${Date.now()}-${fileName.replace(/\s+/g, "-")}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: uniqueFileName,
      ContentType: fileType,
    });

    // 1. Upload කරන්න ආරක්ෂිත URL එකක් හදනවා (Signed URL)
    const uploadUrl = await getSignedUrl(S3, command, { expiresIn: 3600 });

    // 2. ෆයිල් එක Upload වුනාට පස්සේ හැදෙන Public Link එක
    const publicUrl = `${process.env.R2_PUBLIC_DOMAIN}/${uniqueFileName}`;

    return NextResponse.json({ success: true, uploadUrl, publicUrl });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}