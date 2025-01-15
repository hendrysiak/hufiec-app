import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json(
    { message: "Successfully logged out" },
    {
      status: 200,
      headers: {
        "Set-Cookie": [
          `next-auth.session-token=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
          `next-auth.csrf-token=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
          `next-auth.callback-url=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
        ],
      },
    }
  );
}

export async function POST(request: Request) {
  return NextResponse.json(
    { message: "Successfully logged out" },
    {
      status: 200,
      headers: {
        "Set-Cookie": [
          `next-auth.session-token=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
          `next-auth.csrf-token=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
          `next-auth.callback-url=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
        ],
      },
    }
  );
}
