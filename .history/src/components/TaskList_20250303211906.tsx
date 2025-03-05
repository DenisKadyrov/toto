"use client";

import React, { useEffect, useState } from "react";
import TaskItem from "./ui/ListItem";
import Modal from "@/components/Modal";

interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    createdAt: string;
}

const TaskList: React.FC<{ refreshTrigger: number }> = ({ refreshTrigger }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/tasks");
            if (!response.ok) throw new Error("Failed to fetch tasks");
            const data = await response.json();
            setTasks(data.tasks);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [refreshTrigger]); // 👈 Re-fetch when refreshTrigger changes

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <div className="space-y-4">
                {tasks.map((task) => (
                    <div key={task.id} onClick={() => handleTaskClick(task)} className="cursor-pointer">
                        <TaskItem task={task} />
                    </div>
                ))}
            </div>
            {selectedTask && (
                <Modal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    title="Task Details" 
                    type="edit"
                    initValues={selectedTask} 
                    setInit={() => {}} 
                />
            )}
        </div>
    );
};

export default TaskList;
