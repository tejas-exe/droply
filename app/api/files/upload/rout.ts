import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";


const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});


export const POST = async (request: NextRequest) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized: User not authenticated." },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const formUserId = formData.get("userId") as string | null;
        const parentId = formData.get("parentId") as string | null;

        if (formUserId !== userId) {
            return NextResponse.json(
                {
                    error:
                        "User ID mismatch: Provided userId does not match authenticated user.",
                },
                { status: 403 }
            );
        }

        if (!file) {
            return NextResponse.json(
                { error: "Bad Request: No file provided in form data." },
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
                        eq(files.userId, userId),
                        eq(files.isFolder, true)
                    )
                );

            if (!parentFolder) {
                return NextResponse.json(
                    {
                        error: "Parent folder not found or not accessible by the user.",
                    },
                    { status: 404 }
                );
            }
        }



        if (file.type.startsWith("image/") && file.type !== "application/pdf") {
            return NextResponse.json(
                { error: "unsupported file" },
                { status: 400 }
            );
        }
        const buffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(buffer);
        const originalFilename = file.name;
        const fileExtension = originalFilename.split(".").pop() || "";
        const folderPath = parentId
            ? `/droply/${userId}/folders/${parentId}`
            : `/droply/${userId}`;
        const uniqueFilename = `${uuidv4()}.${fileExtension}`;
        const uploadResponse = await imagekit.upload({
            file: fileBuffer,
            fileName: uniqueFilename,
            folder: folderPath,
            useUniqueFileName: false
        })

        const fileData = {
            name: originalFilename,
            path: uploadResponse.filePath,
            size: file.size,
            type: file.type,
            fileUrl: uploadResponse.url,
            thumbnailUrl: uploadResponse.thumbnailUrl || null,
            userId: userId,
            parentId: parentId,
            isFolder: false,
            isStarred: false,
            isTrash: false,
        };

        const [newFile] = await db.insert(files).values(fileData).returning()

        return NextResponse.json(newFile);
    } catch (error) {
        console.error("File upload failed:", error);
        return NextResponse.json(
            { error: "Internal Server Error: File upload failed." },
            { status: 500 }
        );
    }
};
