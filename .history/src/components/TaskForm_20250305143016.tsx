import React from "react";
import { useEffect, useState } from "react";
import { useFormik } from "formik";

import Input from "./ui/Input";
import Button from "./ui/Button";
import { taskSchema } from "@/lib/defenitions";
import { createTask, deleteTask } from "@/actions/tasks";
import { getSubordinates } from "@/actions/bosses";

export default function TaskForm{type}) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function loadUsers() {
            const subordinates = await getSubordinates(); 
            setUsers(subordinates.data.users);
        }
        loadUsers();
    }, []);
    console.log(users)

    const {
        handleSubmit,
        values,
        handleChange,
        errors,
        touched,
        setFieldTouched,
        isValid,
        isSubmitting,
    } = useFormik({
        initialValues: {
            title: "",
            description: "",
            status: "",
            priority: "",
            dueDate: "",
            assignee: "",
        },
        validationSchema: taskSchema,
        onSubmit: async (values, { resetForm }) => {
            if (isValid) {
                await createTask(values);
                resetForm();
            }
        },
    });

    const handleTouched = (field: keyof typeof values) => {
        setFieldTouched(field, true);
    };

    return (
        <>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <Input
                    id="title"
                    name="title"
                    type="text"
                    touchedName={touched.title}
                    errorsName={errors.title}
                    value={values.title}
                    onChange={handleChange}
                    onBlur={() => handleTouched("title")}
                    placeholder="Title"
                    required
                >
                    Title
                </Input>
                <Input
                    id="description"
                    name="description"
                    type="text"
                    touchedName={touched.description}
                    errorsName={errors.description}
                    value={values.description}
                    onChange={handleChange}
                    onBlur={() => handleTouched("description")}
                    placeholder="Description"
                    required
                >
                    Description
                </Input>
                <Input
                    id="priority"
                    name="priority"
                    value={values.priority}
                    datalistValues={["LOW", "MEDIUM", "HIGH"]}
                    onChange={handleChange}
                    onBlur={() => handleTouched("priority")}
                    touchedName={touched.priority}
                    errorsName={errors.priority}
                    required
                >
                    Priority
                </Input>
                <Input
                    id="status"
                    name="status"
                    value={values.status}
                    datalistValues={["PENDING", "IN_PROGRESS", "COMPLETED", "CANCALLED"]}
                    onChange={handleChange}
                    onBlur={() => handleTouched("status")}
                    touchedName={touched.status}
                    errorsName={errors.status}
                    required
                >
                    Status
                </Input>
                <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    touchedName={touched.dueDate}
                    errorsName={errors.dueDate}
                    value={values.dueDate}
                    onChange={handleChange}
                    onBlur={() => handleTouched("dueDate")}
                    required
                >
                    Due Date
                </Input>
                <Input
                    id="assignee"
                    name="assignee"
                    value={values.assignee}
                    datalistValues={users.map(user => `${user.firstName} ${user.lastName} ${user.patronymic}`)}
                    onChange={handleChange}
                    onBlur={() => handleTouched("assignee")}
                    touchedName={touched.assignee}
                    errorsName={errors.assignee}
                    required
                >
                    Assignee
                </Input>
                <Button type="submit" disabled={!isValid || isSubmitting}>
                    Save
                </Button>
            </form>
                { type === "edit" 
                    ? <Button onClick={()=> {deleteTask(values)}} type="button" buttonType="Delete" >Delete</Button> 
                    : ""
                }
        </>
    );
}