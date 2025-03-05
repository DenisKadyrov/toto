import prisma from "@/lib/prisma";
import {NextRequest, NextResponse} from "next/server";
import jwt from "jsonwebtoken";


export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY!);

        if (typeof decoded !== "object" || !("id" in decoded)) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const userId = decoded.id as string;

        const tasks = await prisma.user.findMany({
            where: {
                OR: [
                    {subordinate: userId},
                    {id: userId}
                ],
            },
        });

        return NextResponse.json({
            success: true,
            tasks,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
