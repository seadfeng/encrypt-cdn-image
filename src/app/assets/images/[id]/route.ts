import { appConfig } from "@/config";
import { TextCrypto } from "@/lib/textCrypto";

export const runtime = "edge";
const { cryptoPassword } = appConfig;

export async function GET(
  __req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const crypto = new TextCrypto();
    const id = params.id.replace(/\.(jpg|png|webp|gif|jpeg)/, '')

    if (!id || !cryptoPassword) {
      return new Response("Invalid request", { status: 400 });
    }


    let imageUrl: string;
    try {
      imageUrl = await crypto.decrypt(id, cryptoPassword);
      new URL(imageUrl);
    } catch (error) {
      return new Response("Invalid URL", { status: 400 });
    }
    const urlImage = new URL(imageUrl);

    let contentType = "image/jpeg";
    const fetchOptions: RequestInit = {
      headers: {
        'Cache-Control': 'no-cache',
        "user-agent": "encrypt-cdn-image"
      }
    };
    const response = await fetch(urlImage, fetchOptions);

    contentType = response.headers.get('content-type') || contentType;

    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000",
      },
    });

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}