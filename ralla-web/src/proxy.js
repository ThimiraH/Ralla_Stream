import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// 1. මෙතන 'middleware/proxy' කියලා නම දාන එක අනිවාර්යයි. middleware දැන් deprecated.
export async function proxy(req) {
  
  // Login වෙලාද බලනවා
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  // User ඉල්ලන URL එක ගන්නවා
  const url = req.nextUrl.clone();

  // --- ADMIN PROTECTION ---
  // යූසර් යන්න හදන්නේ /admin පාරේ නම්...
  if (url.pathname.startsWith("/admin")) {
    
    // A. Login වෙලා නැත්නම් -> Login Page එකට යවනවා
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // B. Login වෙලා, හැබැයි role එක 'admin' නෙවෙයි නම් -> Home Page එකට එලවනවා
    if (token.isAdmin !== true) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

// 2. මේ නීතිය බලපාන්නේ මොන පිටු වලටද කියලා මෙතන කියනවා
export const config = {
  matcher: ["/admin/:path*"], 
};