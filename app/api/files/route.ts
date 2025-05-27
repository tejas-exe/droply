import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const GET = async (request: NextRequest) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized: User not authenticated." },
                { status: 401 }
            );
        }

        const searchParams = request.nextUrl.searchParams
        const queryUserId = searchParams.get("userId");
        const parentId = searchParams.get("parentId");
        if (queryUserId !== userId) {
            return NextResponse.json(
                { error: "User ID mismatch: Provided userAuthId does not match the authenticated user." },
                { status: 403 }
            );
        }
        let filesFolder;
        if (parentId) {
            filesFolder = await db.select().from(files).where(
                and(
                    eq(files.userId, userId),
                    eq(files.parentId, parentId)
                ))
        } else {
            filesFolder = await db.select().from(files)
                .where(
                    and(
                        eq(files.userId, userId),
                        isNull(files.parentId)
                    )
                )

        }

        return NextResponse.json(filesFolder)
    } catch (error) {
        console.error("Internal Server Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error: Unable to process the request." },
            { status: 500 }
        );
    }
}