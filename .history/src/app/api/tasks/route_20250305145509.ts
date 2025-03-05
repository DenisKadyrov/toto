import prisma from "@/lib/prisma";
import { Status, Priority} from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";


export async function POST(request: NextRequest) {
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
        const body = await request.json();
        const resList = request; 

        const newTask = await prisma.task.create({
            data: {
                title: body.title,
                description: body.description,
                status: Status[body.status.toUpperCase()],
                priority: Priority[body.priority.toUpperCase()],
                creatorId: userId,
                responsibleId: userId,
            },
        });

        return NextResponse.json({
            message: "Task created successfully",
            success: true,
            task: newTask,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

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

        const tasks = await prisma.task.findMany({
            where: {
                creatorId: userId,
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

export async function PATCH(request: NextRequest) {
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
        const body = await request.json();

        if (!body.id) {
            return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
        }

        const existingTask = await prisma.task.findUnique({
            where: { id: body.id },
        });

        if (!existingTask) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        if (existingTask.creatorId !== userId) {
            return NextResponse.json({ error: "You do not have permission to update this task" }, { status: 403 });
        }
        const respId = await 

        const updatedTask = await prisma.task.update({
            where: { id: body.id },
            data: {
                title: body.title,
                description: body.description,
                status: Status[body.status.toUpperCase()],
                priority: Priority[body.priority.toUpperCase()],
                responsibleId: body.assignee,
            },
        });

        return NextResponse.json({
            message: "Task updated successfully",
            success: true,
            task: updatedTask,
        });
    } catch (error: any) {
        console.log(error.message)
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
