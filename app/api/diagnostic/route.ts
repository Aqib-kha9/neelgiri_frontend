import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    console.log("------------------------------------------");
    console.log("🔍 DIAGNOSTIC ROUTE HIT");
    console.log("------------------------------------------");

    try {
        const body = await request.json();
        console.log("📦 Payload received from browser:", JSON.stringify(body, null, 2));

        console.log("🚀 Proxying to Backend: https://delivery-rr9w.onrender.com/api/auth/login");
        const backendRes = await fetch("https://delivery-rr9w.onrender.com/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        console.log(`Backend Status: ${backendRes.status}`);
        const data = await backendRes.json();
        console.log("Backend Data:", JSON.stringify(data, null, 2));

        return NextResponse.json(data, { status: backendRes.status });
    } catch (error: any) {
        console.error("❌ Diagnostic Error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
