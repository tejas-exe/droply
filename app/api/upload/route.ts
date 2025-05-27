import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


const POST = async (request: NextRequest) => {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const body = await request.json()
        const { imagekit, userAuthId } = body

        if (userAuthId !== userId) {
            return NextResponse.json({ error: "uid uncached" }, { status: 500 })
        }
        if (!imagekit || imagekit.url) {
            return NextResponse.json({ error: "image kit missing" }, { status: 500 })
        }

        const fileData = {
            name: imagekit.name || "Untitled",
            path: imagekit.filePath || `/droply/${userId}/${imagekit.name}`,
            size: imagekit.size || 0,
            type: imagekit.fileType || "image",
            fileUrl: imagekit.url,
            thumbnailUrl: imagekit.thumbnailUrl || null,
            userId: userId,
            parentId: null,
            isFolder: false,
            isStarred: false,
            isTrash: false,
        };

        const [newFile] = await db.insert(files).values(fileData).returning()
        return NextResponse.json(newFile, { status: 201 })

    } catch (error) {
        return NextResponse.json({ error: "error colored" }, { status: 500 })
    }
}