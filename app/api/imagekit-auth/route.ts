import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import ImageKit from "imagekit"
import { error } from "console";


const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});


export const GET = async () => {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    }
    const authParams = imagekit.getAuthenticationParameters()
    return NextResponse.json(authParams)
  } catch (error) {
    return NextResponse.json({ error: "error occored" }, { status: 500 })
  }
}