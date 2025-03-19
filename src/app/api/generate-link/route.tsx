import { NextRequest } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import { Collection } from "mongodb";
import { FileData } from "@/utils/types";

export async function POST(request: NextRequest): Promise<Response> {
    const contentType = request.headers.get("content-type");

    if (contentType == null || !contentType.includes("multipart/form-data")) {
        return Response.json({ message: "No file uploaded" }, { status: 400 });
    }

    const formData: FormData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
        return Response.json({ message: "File is empty" }, { status: 400 });
    }

    const fileBuffer: Buffer = Buffer.from(await file.arrayBuffer());

    try {
        const { db } = await connectToDatabase();
        const collection: Collection<FileData> = db.collection(
            process.env.MONGODB_COLLECTION as string,
        );

        const document: FileData = {
            name: file.name,
            size: file.size,
            type: file.type,
            file: fileBuffer,
            createdAt: new Date(),
        };

        const result = await collection.insertOne(document);
        return Response.json({
            message: "Data stored successfully",
            fileId: result.insertedId,
        });
    } catch (error: unknown) {
        return Response.json({
            message: "Error storing data",
            error: (error as Error).message,
        });
    }
}
