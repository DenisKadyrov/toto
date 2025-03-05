"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import TaskList from "@/components/TaskList";
import Modal from "@/components/Modal";

const Page = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // 👈 State to trigger re-fetch
    const [initValues, setInitValues] = useState({
        title: "",
        description: "",
        status: "",
        priority: "",
    });

    const refreshTasks = () => setRefreshTrigger((prev) => prev + 1); // 👈 Increments trigger

    return (
        <>
            <Navbar onclickFunc={() => setIsModalOpen(true)} />
            <TaskList refreshTrigger={refreshTasks} />
            <div className="flex flex-col items-center absolute justify-center min-h-screen">
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Task" initValues={initValues} setInit={setInitValues} />
            </div>
        </>
    );
};

export default Page;