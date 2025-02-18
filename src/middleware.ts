
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const apiTokenHeader = req.headers.get('x-api-key');
  const apiToken = process.env.NEXT_API_SECRET!;

  if (!apiTokenHeader) {
    return new Response(JSON.stringify(
      { error: "Unauthorized", message: 'Missing x-api-key' }
    ), { status: 400, headers: { 'Content-Type': 'text/json' } });
  }
  if (apiTokenHeader !== apiToken) {
    return new Response(JSON.stringify(
      { error: "Unauthorized", message: 'x-api-key not match' }
    ), { status: 403, headers: { 'Content-Type': 'text/json' } });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/:path*']
};