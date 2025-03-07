import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const user_id = req.cookies.get("user_id");

  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "http://localhost:3000";

  if (!user_id) {
    return NextResponse.redirect(`${baseUrl}`);
  }
}

export const config = {
  matcher: ["/dashboard", "/perfil"],
};
