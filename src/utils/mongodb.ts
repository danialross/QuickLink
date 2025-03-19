import { Db, MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .env.local",
    );
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function connectToDatabase() {
    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }

    const client = new MongoClient(MONGODB_URI); // ✅ No options needed
    await client.connect();
    const db = client.db(); // Automatically picks the database from the URI

    await db
        .collection("files")
        .createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });
    console.log("✅ TTL index ensured on 'files' collection");

    cachedClient = client;
    cachedDb = db;

    return { client, db };
}

export default connectToDatabase;
