import React, { useEffect, useState } from "react";
import { useFormik } from "formik";

import Input from "./ui/Input";
import Button from "./ui/Button";
import { taskSchema } from "@/lib/defenitions";
import { createTask, updateTask, deleteTask } from "@/actions/tasks";
import { getSubordinates } from "@/actions/bosses";

export default function TaskForm({ type, initValues, onClose }) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function loadUsers() {
            const subordinates = await getSubordinates(); 
            setUsers(subordinates.data.users);
        }
        loadUsers();
    }, []);

    const formik = useFormik({
        initialValues: initValues || {
            title: "",
            description: "",
            status: "PENDING",
            priority: "MEDIUM",
            dueDate: "",
            assignee: "",
        },
        validationSchema: taskSchema,
        onSubmit: async (values, { resetForm }) => {
            if (type === "edit") {
                await updateTask(values);
            } else {
                await createTask(values);
            }
            resetForm();
            onClose();
        },
    });

    return (
        <>
            <form className="space-y-6" onSubmit={formik.handleSubmit}>
                <Input
                    id="title"
                    name="title"
                    type="text"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Title"
                    required
                >
                    Title
                </Input>
                <Input
                    id="description"
                    name="description"
                    type="text"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Description"
                    required
                >
                    Description
                </Input>
                <Input
                    id="priority"
                    name="priority"
                    value={formik.values.priority}
                    datalistValues={["LOW", "MEDIUM", "HIGH"]}
                    onChange={formik.handleChange}
                    required
                >
                    Priority
                </Input>
                <Input
                    id="status"
                    name="status"
                    value={formik.values.status}
                    datalistValues={["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]}
                    onChange={formik.handleChange}
                    required
                >
                    Status
                </Input>
                <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={formik.values.dueDate}
                    onChange={formik.handleChange}
                    required
                >
                    Due Date
                </Input>
                <Input
                    id="assignee"
                    name="assignee"
                    value={formik.values.assignee}
                    datalistValues={users.map(user => `${user.firstName} ${user.lastName} ${user.patronymic}`)}
                    onChange={formik.handleChange}
                    required
                >
                    Assignee
                </Input>
                <Button type="submit">
                    {type === "edit" ? "Update Task" : "Create Task"}
                </Button>
            </form>
        </>
    );
}
