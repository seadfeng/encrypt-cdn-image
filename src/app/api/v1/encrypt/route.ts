import { appConfig } from "@/config";
import { TextCrypto } from "@/lib/textCrypto";
import { NextRequest } from "next/server";

export const runtime = "edge";
const { cryptoPassword } = appConfig;

export async function POST(req: NextRequest) {
  try {
    const { origin } = req.nextUrl;
    const crypto = new TextCrypto();
    const { url } = await req.json() as {
      url?: string;
    };

    if (!url) {
      throw new Error("url is null");
    }
    if (!cryptoPassword) {
      return new Response("cryptoPassword not found", { status: 400 });
    }
    const encrypt_url = await crypto.encrypt(url, cryptoPassword);
    return new Response(JSON.stringify({
      status: "ok",
      encrypt_url: `${origin}/assets/images/${encrypt_url}`
    }), {
      status: 200,
    });

  } catch (error: any) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({
      error: "Unexpected", message: error?.message ?? ""
    }), { status: 500 });
  }
}