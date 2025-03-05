File: src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  //extracting url paths
  const path = request.nextUrl.pathname;

  const isPublicPath = path === "/login" || path === "/signup";

  //extract the token from user cookies
  const token = request.cookies.get("token")?.value || "";

  // if (isPublicPath && token) {
  //   return NextResponse.redirect(new URL("/", request.nextUrl));
  // }
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/login", "/signup"],
};

------------------------------
File: src/lib/defenitions.ts
import * as yup from "yup";

export const signupSchema = yup.object().shape({
	firstname: yup
		.string()
		.required("Firstname is required")
		.min(3, "Firtname must be at least 3 characters")
		.max(20, "Firstname must not exceed 20 characters")
		.matches(
			/^[a-zA-Z-]+$/,
			"Firstname can only contain letters"
		),
	lastname: yup
		.string()
		.required("Lastname is required")
		.min(3, "Lastname must be at least 3 characters")
		.max(20, "Lastname must not exceed 20 characters")
		.matches(
			/^[a-zA-Z-]+$/,
			"Lastname can only contain letters"
		),
	patronymic: yup
		.string()
		.required("Patronymic is required")
		.min(3, "Patronymic must be at least 3 characters")
		.max(20, "Patronymic must not exceed 20 characters")
		.matches(
			/^[a-zA-Z-]+$/,
			"Patronymic can only contain letters"
		),
	login: yup
    .string()
    .required("Login is required")
    .min(3, "Login must be at least 3 characters")
    .max(20, "Login must not exceed 20 characters")
    .matches(
      /^[a-zA-Z0-9_-]+$/,
      "Login can only contain letters, numbers, underscores, and hyphens",
    ),
	password: yup
		.string()
		.required("Password is required")
		.min(8, "Password must be at least 8 characters")
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]+$/,
			"Password must contain at least one uppercase letter, one lowercase letter, and one digit"
		),
});

export const loginSchema = yup.object().shape({
	login: yup
	.string()
	.required("Login is required")
	.min(3, "Login must be at least 3 characters")
    .max(20, "Login must not exceed 20 characters")
    .matches(
      /^[a-zA-Z0-9_-]+$/,
      "Login can only contain letters, numbers, underscores, and hyphens",
    ),
	password: yup
		.string()
		.required("Password is required")
		.min(8, "Password must be at least 8 characters")
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]+$/,
			"Password must contain at least one uppercase letter, one lowercase letter, and one digit"
		),
});

export const taskSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(20, "Title must not exceed 20 characters")
    .matches(
      /^[a-zA-Z-]+$/,
      "Title can only contain letters"
    ),
  description: yup
    .string()
    .required("Description is required")
    .min(3, "Description must be at least 3 characters")
    .max(200, "Description must not exceed 200 characters")
    .matches(
      /^[a-zA-Z-]+$/,
      "Description can only contain letters"
    ),
  priority: yup
    .string()
    .oneOf(["LOW", "MEDIUM", "HIGH"], "Priority must be one of 'low', 'medium', or 'high'")
    .required("Priority is required"),
  status: yup
    .string()
    .oneOf(["PENDING", "IN_PROGRESS", "COPLETED", "CANCALLED"], "Status must be one of 'pending', 'in-progress', or 'completed'")
    .required("Status is required"),
});
------------------------------
File: src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())

const globalForPrisma = global as unknown as { prisma: typeof prisma }

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
------------------------------
File: src/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}

enum Status {
  PENDING
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

model Task {
  id             Int       @id @default(autoincrement())
  title          String    @unique @db.VarChar(100) 
  description    String    @db.VarChar(300)
  finishedAt      DateTime?
  createdAt      DateTime  @default(now()) @map("created_at")
  updatedAt      DateTime? @updatedAt @map("updated_at")
  priority       Priority
  status         Status
  creator        User      @relation("CreatedTasks", fields: [creatorId], references: [id])
  creatorId      Int
  responsiblePer User      @relation("ReponTasks", fields: [responsibleId], references: [id])
  responsibleId  Int
  
  @@map("tasks")
}

model User {
  id         Int     @id @default(autoincrement())
  firstName   String  @db.VarChar(100)
  lastName   String  @db.VarChar(100)
  patronymic String  @db.VarChar(100)
  login      String  @unique @db.VarChar(100)
  password   String
  boss       User?   @relation("Boss", fields: [bossId], references: [id])
  bossId     Int?
  subordinate User[] @relation("Boss")
  tasks      Task[]  @relation("CreatedTasks")
  respTasks  Task[]  @relation("ReponTasks")
  
  @@map("users")
}
------------------------------
File: src/prisma/migrations/migration_lock.toml
# Please do not edit this file manually
# It should be added in your version-control system (e.g., Git)
provider = "postgresql"
------------------------------
File: src/prisma/migrations/20250303193314_task_title_unique/migration.sql
/*
  Warnings:

  - The values [CREATED] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[title]` on the table `tasks` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
ALTER TABLE "tasks" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
COMMIT;

-- CreateIndex
CREATE UNIQUE INDEX "tasks_title_key" ON "tasks"("title");

------------------------------
File: src/prisma/migrations/20250227141550_init/migration.sql
-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" VARCHAR(300) NOT NULL,
    "finishedAt" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "priority" "Priority" NOT NULL,
    "status" "Status" NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "responsibleId" INTEGER NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "patronymic" VARCHAR(100) NOT NULL,
    "login" VARCHAR(100) NOT NULL,
    "password" TEXT NOT NULL,
    "bossId" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_bossId_fkey" FOREIGN KEY ("bossId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

------------------------------
File: src/prisma/migrations/20250303005828_status_en/migration.sql
/*
  Warnings:

  - The values [Created] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('CREATED', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
ALTER TABLE "tasks" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
COMMIT;

------------------------------
File: src/prisma/migrations/20250228191603_fix_boss/migration.sql
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_bossId_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "bossId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_bossId_fkey" FOREIGN KEY ("bossId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

------------------------------
File: src/prisma/migrations/20250302233458_fix_task/migration.sql
-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "finishedAt" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

------------------------------
File: src/prisma/migrations/20250303005609_status_en/migration.sql
-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'Created';

------------------------------
File: src/actions/tasks.ts
import axios from "axios";


export const createTask = async (values: any) => {
    try {
        const response = await axios.post("/api/tasks/", values);

    } catch (error: any) {
        console.log("anything not ok")
    }
};

export const deleteTask = async (values: any) => {
    try {
        console.log(values)
        const response = await axios.delete("/api/tasks", values)
    } catch (error: any) {
        console.log("I'm not OK!")
    }
}
------------------------------
File: src/actions/signup.ts
import axios from "axios";


export const onSignup = async (values: any, router: any) => {
    try {
        const response = await axios.post(`/api/users/signup`, values);
        const responseData = response.data;

        if (!responseData.error) {
            // toast.success("Signup success", successState);
            router.push("/login");
            // toast({title: responseData.message});
        }
    } catch (error: any) {
        // if (error.response.data.error) {
        console.log("anything not ok")
            // If server response contains error message, display it
            // toast({title: error.response.data.error, variant: "destructive"});
        // } else {
            // Otherwise, display a generic error message
            // toast({title: "An error occurred during login. Please try again later."});
        // }
        // resetForm();
    }
}
------------------------------
File: src/actions/login.ts
import axios from "axios";


export const onLogin = async (values: any, router: any) => {
    try {
        const response = await axios.post("/api/users/login", values);
        const responseData = response.data;
        if (!responseData.error) {
            // No error, redirect to home page
            router.push("/");
            // toast({title: responseData.message});
        }
    } catch (error: any) {
        console.log("anything not ok")
        // Handle network errors or other exceptions
        // const errorMessage =
        // 	error.response?.data?.error || "An error occurred during login.";

        // toast({title: errorMessage});
    }
};
------------------------------
File: src/actions/bosses.ts
import axios from "axios";

export async function getSubordinates() {
    try {
        const response = await axios.get("/api/users/bosses")
        return response
    } catch {
        console.log("wrong");
    }
}
------------------------------
File: src/actions/users.ts
import axios from "axios";

export async function getUsers() {
    try {
        const response = await axios.get("/api/users");
        return response
    } catch {
        console.log("any");
    }
}
------------------------------
File: src/components/TodosMessage.tsx
export default function ({ task, done, onComplete, onRemove }) {
  const defaultClasses =
    "bg-sky-100 rounded flex justify-between items-center gap-2 p-3 group hover:cursor-pointer hover:bg-slate-100 transition text-blue-500";
  const doneClasses =
    "flex justify-between items-center p-3 gap-2 rounded bg-blue-500 text-white";

  const completeTask = () => {
    onComplete(task.id);
  };

  const removeTask = () => {
    onRemove(task.id);
  };

  return (
    <div className={!done ? defaultClasses : doneClasses}>
      <span className="flex-1">{task.task}</span>
      {/* {!done && (
        <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity">
          <TaskButton type="done" onClick={completeTask} />
          <TaskButton onClick={removeTask} />
        </div> */ 
		true}
      )}
      {done && (
        <div className="bg-sky-100 text-center rounded-full text-blue-500 flex justify-center items-center p-1">
          <span className="text-blue-500 font-bold material-symbols-outlined">
            done
          </span>
        </div>
      )}
    </div>
  );
}
------------------------------
File: src/components/SignupForm.tsx
import React from "react";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";

import Input from "./ui/Input";
import Button from "./ui/Button";
import { onSignup } from "@/actions/signup";
import { signupSchema } from "@/lib/defenitions";
import { getUsers } from "@/actions/users"


export default function SignupForm() {
    const router = useRouter();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function loadUsers() {
            const userList = await getUsers(); 
            setUsers(userList.data.users);
        }
        loadUsers();
    }, []);
    const {
            values,
            handleChange,
            handleSubmit,
            isValid,
            isSubmitting,
            errors,
            touched,
            setFieldTouched,
        } = useFormik({
            initialValues: {
                login: "",
                password: "",
                firstname: "",
                lastname: "",
                patronymic: "",
                boss: "",
            },
            validationSchema: signupSchema,
            onSubmit: (values) => {
                //1st check on first render and refresh value is not empty
                if (values.firstname && values.lastname && values.patronymic && values.login && values.password) {
                    onSignup(values, router);
                }
            },
        });

    const handleBlur = (field: string) => {
		setFieldTouched(field, true);
	};
    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
                id="login"
                name="login"
                type="text"
                touchedName={touched.login}
                errorsName={errors.login}
                value={values.login}
                onChange={handleChange}
                onBlur={() => handleBlur("login")}
                placeholder="your login"
                required
            >
                Login
            </Input>
            <Input
                id="firstname"
                name="firstname"
                type="text"
                touchedName={touched.firstname}
                errorsName={errors.firstname}
                value={values.firstname}
                onChange={handleChange}
                onBlur={() => handleBlur("firstname")}
                placeholder="firstname"
                required
            >
                First Name
            </Input>
            <Input
                id="lastname"
                name="lastname"
                type="text"
                touchedName={touched.lastname}
                errorsName={errors.lastname}
                value={values.lastname}
                onChange={handleChange}
                onBlur={() => handleBlur("lastname")}
                placeholder="lastname"
                required
            >
                Last Name
            </Input>
            <Input
                id="patronymic"
                name="patronymic"
                type="text"
                touchedName={touched.patronymic}
                errorsName={errors.patronymic}
                value={values.patronymic}
                onChange={handleChange}
                onBlur={() => handleBlur("patronymic")}
                placeholder="patronymic"
                required
            >
                Patronymic
            </Input>
            <Input
                id="password"
                name="password"
                type="password"
                touchedName={touched.password}
                errorsName={touched.password}
                value={values.password}
                onChange={handleChange}
                placeholder="password"
                onBlur={() => handleBlur("password")}
                autoComplete="current-password"
                required
            >
                Password
            </Input>
            <Input
                id="boss"
                name="boss"
                value={values.boss}
                datalistValues={users.map(user => `${user.firstName} ${user.lastName} ${user.patronymic}`)}
                onChange={handleChange}
                touchedName={touched.boss}
                errorsName={errors.boss}
            >
                Boss
            </Input>
            <Button
                onClick={onSignup}
                type="suhmit"
                disabled={!isValid || isSubmitting}
            >
                Log in
            </Button>
        </form>
    );
}
------------------------------
File: src/components/LoginForm.tsx
import React from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";

import Input from "./ui/Input";
import Button from "./ui/Button";
import { onLogin } from "@/actions/login";
import { loginSchema } from "@/lib/defenitions";


export default function LoginForm() {
    const router = useRouter();
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
            login: "",
            password: "",
        },
        validationSchema: loginSchema,
        onSubmit: async (values, {resetForm}) => {
            if (isValid) {
                await onLogin(values, router);
                resetForm();
            }
        },
    });

    const handleTouched = (field: string) => {
		setFieldTouched(field, true);
	};
    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
                id="login"
                name="login"
                type="text"
                touchedName={touched.login}
                errorsName={errors.login}
                value={values.login}
                onChange={handleChange}
                onBlur={() => handleTouched("login")}
                placeholder="login"
                required
            >
                Login
            </Input>
            <Input
                id="password"
                name="password"
                type="password"
                touchedName={touched.password}
                errorsName={errors.password}
                value={values.password}
                onChange={handleChange}
                onBlur={() => handleTouched("password")}
                placeholder="rahul@1999"
                required
            >
                Password
            </Input>
            <Button
                onClick={onLogin}
                type="submit"
                disabled={!isValid || isSubmitting}
            >
                Log in
            </Button>
        </form>
    );
}
------------------------------
File: src/components/Navbar.tsx
"use client";
import React from "react";

import Button from "./ui/Button";


const Navbar = ({onclickFunc}) => {
  return (
    <nav className="w-full bg-gray-900 text-white px-6 py-3 flex items-center justify-end">
      <Button onClick={onclickFunc}>
        Create Task
      </Button>
    </nav>
  );
};

export default Navbar;

------------------------------
File: src/components/Modal.tsx
import React from "react";
import TaskForm from "@/components/TaskForm"


const Modal = ({ isOpen, onClose, title, initValues, setInit, type}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-5 relative animate-fadeIn">
                {/* Title & Close Button */}
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✖
                    </button>
                </div>

                {/* Modal Content */}
                <div className="mt-4">
					<TaskForm initValues={initValues} setInit={setInit} type={type}/>
				</div>
            </div>
        </div>
    );
};

export default Modal;

------------------------------
File: src/components/TaskList.tsx
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

------------------------------
File: src/components/TaskForm.tsx
import React from "react";
import { useEffect, useState } from "react";
import { useFormik } from "formik";

import Input from "./ui/Input";
import Button from "./ui/Button";
import { taskSchema } from "@/lib/defenitions";
import { createTask, deleteTask } from "@/actions/tasks";
import { getSubordinates } from "@/actions/bosses";

export default function TaskForm({type}) {
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
                    datalistValues={users.map(user => `${user.firstName} ${user.ame}`)}
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
------------------------------
File: src/components/ui/use-toast.ts
"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }

------------------------------
File: src/components/ui/toaster.tsx
"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

------------------------------
File: src/components/ui/ListItem.tsx
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
                <span className="text-xs text-gray-500">{new Date(task.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
    );
};

export default TaskItem;

------------------------------
File: src/components/ui/toast.tsx
"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}

------------------------------
File: src/components/ui/Input.tsx
import React, { ChangeEvent, InputHTMLAttributes } from "react";


interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  touchedName?: boolean;
  errorsName?: string;
  datalistValues?: string[];
}

export default function Input({
  children,
  touchedName,
  errorsName,
  datalistValues,
  onChange,
  ...props
}: InputProps) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div>
      <label htmlFor={props.name} className="block text-sm font-medium leading-6 text-black">
        {children}
      </label>

      {datalistValues ? (
        <select
          {...props}
          className="w-full rounded-md border-5 bg-transparent/5 border-gray-600 py-1.5 text-black shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
          onChange={handleInputChange}
          value={props.value}
        >
          <option value="" disabled>Select {children}</option>
          {datalistValues.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <div className="mt-2">
          <input
            {...props}
            className={`w-full rounded-md border-5 bg-transparent/5 border-gray-600 py-1.5 text-black shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 ${
              touchedName && errorsName ? "border-red-600" : ""
            }`}
            onChange={handleInputChange}
          />
          {touchedName && errorsName && <p className="text-red-600 mt-2 text-sm">{errorsName}</p>}
        </div>
      )}
    </div>
  );
}
------------------------------
File: src/components/ui/DataList.tsx
import { useState } from "react";


interface DataListProps {
  values: string[];
  onChange?: (selectedValue: string) => void;
}

export default function DataList({ values, onChange }: DataListProps) {
  const [selectedValue, setSelectedValue] = useState<string>(values[0] || "");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <select
      name="priority"
      id="priority"
      className="w-full rounded-md border-5 bg-transparent/5 placeholder:text-black/30 border-gray-600 py-1.5 text-black shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:border-blue-600 focus:ring-2 focus:ring-blue-600"
      value={selectedValue}
      onChange={handleChange}
    >
      {values.map((val) => (
        <option key={val} value={val}>
          {val}
        </option>
      ))}
    </select>
  );
}

------------------------------
File: src/components/ui/Button.tsx
import React from "react";


export default function Button({children, buttonType, ...props}) {
    return (
        <>
            <button
                {...props}
                className={`cursor-pointer flex items-center gap-2 justify-center rounded-md ${(buttonType === "Delete") ? "bg-red-600": "bg-blue-600"} px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`} >
                {children}
            </button>
        </>
    );
}

