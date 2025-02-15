import { NextRequest } from "next/server";

export function POST(request: NextRequest) {
    console.log(request);
    return new Response(JSON.stringify({ link: "heelowowrd" }), { headers: { "Content-Type": "application/json" } }
    );
}