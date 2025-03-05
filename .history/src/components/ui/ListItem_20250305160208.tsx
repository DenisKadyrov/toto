import React from "react";
import { Status, Priority } from "@prisma/client";

interface TaskProps {
    id: number;
    title: string;
    description: string;
    status: Status;
    priority: Priority;
    createdAt: string;
}

const TaskItem: React.FC<{ task: TaskProps }> = ({ task }) => {
    return (
        <div className="border rounded-lg p-4 shadow-md bg-white">
            <h3 className="text-lg font-bold">{task.title}</h3>
            <p className="text-gray-600">{task.description}</p>
            <div className="mt-2 flex justify-between items-center">
                <span className={`px-2 py-1 text-xs font-semibold rounded ${task.status === "COMPLETED" ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-800"}`}>
                    {task.status}
                </span>
                <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    task.priority === "HIGH" ? "bg-red-200 text-red-800" : 
                    task.priority === "MEDIUM" ? "bg-yellow-200 text-yellow-800" : 
                    "bg-blue-200 text-blue-800"
                }`}>
                    {task.priority}
                </span>
                <span className="text-xs text-gray-500">{new Date(task.finishedAt).toLocaleDateString()}</span>
            </div>
        </div>
    );
};

export default TaskItem;
