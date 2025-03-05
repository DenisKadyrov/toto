"use client";

import React, { useEffect, useState } from "react";
import TaskItem from "./ui/ListItem";
import Modal from "@/components/Modal";

const TaskList = ({ refreshTrigger }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/tasks");
            if (!response.ok) throw new Error("Failed to fetch tasks");
            const data = await response.json();
            setTasks(data.tasks);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [refreshTrigger]);

    const handleTaskClick = (task) => {
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
                    title="Edit Task"
                    type="edit"
                    initValues={selectedTask}
                />
            )}
        </div>
    );
};

export default TaskList;
