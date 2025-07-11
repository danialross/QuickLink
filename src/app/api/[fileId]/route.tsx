import { NextRequest } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import { Collection, ObjectId } from "mongodb";
import { FileData } from "@/utils/types";

export async function GET(request: NextRequest) {
    const id = request.nextUrl.pathname.split("/api/")[1];

    try {
        const { db } = await connectToDatabase();
        const collection: Collection<FileData> = db.collection(
            process.env.MONGODB_COLLECTION as string,
        );
        const result = await collection.findOne({
            _id: new ObjectId(id),
        });

        if (!result) {
            return Response.json({ message: "The file does not exist" });
        }

        return Response.json({ ...result });
    } catch (e) {
        console.error("Error retrieving file : ", (e as Error).message);
    }
    return Response.json(null);
}
