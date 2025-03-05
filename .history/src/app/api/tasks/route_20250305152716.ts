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
        console.log(body)
        const resp = body.assignee.split(" "); 

        const respID = prisma.user.findFirst({
            where: {
                AND: [
                    {firstName: resp[0]},
                    {lastName: resp[1]},
                    {patronymic: resp[2]}
                ]
            },
        });

        const newTask = await prisma.task.create({
            data: {
                title: body.title,
                description: body.description,
                status: Status[body.status.toUpperCase()],
                priority: Priority[body.priority.toUpperCase()],
                finishedAt: new Date(body.dueDate),
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
        console.log(error.message)
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
        console.log(body)

        if (!body.title) {
            return NextResponse.json({ error: "Task Title is required" }, { status: 400 });
        }

        const existingTask = await prisma.task.findUnique({
            where: { id: body.id},
        });

        if (!existingTask) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        if (existingTask.creatorId !== userId) {
            return NextResponse.json({ error: "You do not have permission to update this task" }, { status: 403 });
        }
        const resp = await prisma.user.findFirst({
            where: {
                AND: [
                    {firstName: respName[0]},
                    {lastName: respName[1]},
                    {patronymic: respName[2]},
                ],
            },
        });

        const updatedTask = await prisma.task.update({
            where: { id: body.id },
            data: {
                title: body.title,
                description: body.description,
                status: Status[body.status.toUpperCase()],
                priority: Priority[body.priority.toUpperCase()],
                responsibleId: resp.id,
                finishedAt: new Date(body.dueDate),
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
