import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid"

export const POST = async (request: NextRequest) => {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized: User not authenticated." },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, userAuthId, parentId = null } = body;

        if (userAuthId !== userId) {
            return NextResponse.json(
                { error: "User ID mismatch: Provided userAuthId does not match the authenticated user." },
                { status: 403 }
            );
        }

        if (!name || typeof name !== "string" || name.trim() === "") {
            return NextResponse.json(
                { error: "Invalid name: Folder name must be a non-empty string." },
                { status: 400 }
            );
        }

        if (parentId) {
            const [parentFolder] = await db
                .select()
                .from(files)
                .where(
                    and(
                        eq(files.id, parentId),
                        eq(files.userId, userAuthId),
                        eq(files.isFolder, true)
                    )
                );

            if (!parentFolder) {
                return NextResponse.json(
                    { error: "Parent folder not found or not accessible." },
                    { status: 404 }
                );
            }
        }
        // create folder in db

        const [newFolder] = await db.insert(files).values(body).returning()

        // Add your file/folder creation logic here if needed

        const payload = {
            id: uuidv4(),
            name: name.trim(),
            path: `/folders/${userId}/${uuidv4()}`,
            size: 0,
            type: "folder",
            fileUrl: "",
            thumbnailUrl: null,
            userId,
            parentId,
            isFolder: true,
            isStarred: false,
            isTrash: false,
        }

        return NextResponse.json({ success: true, message: "Folder successfully.", folder: newFolder }, { status: 200 });

    } catch (error) {
        console.error("Internal Server Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error: Unable to process the request." },
            { status: 500 }
        );
    }
};
