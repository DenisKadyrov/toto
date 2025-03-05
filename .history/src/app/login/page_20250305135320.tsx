"use client";
import Link from "next/link";
import {useRouter} from "next/navigation";
import axios from "axios";
import {useFormik} from "formik";
import * as yup from "yup";
import LoginForm from "@/components/LoginForm";

//ToDo Some Error Check not working properly in if else cases handle later



export default function LoginPage() {
	return (
		<>
			<div className="flex h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<p className="mx-auto h-10 w-auto flex justify-center items-center font-black text-blue-500 text-2xl">
						TodoApp
					</p>
					<h2 className="mt-5 text-center text-2xl font-medium leading-9 tracking-tight text-black">
						Login to your account
					</h2>
				</div>
				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<LoginForm />
					
				</div>
			</div>
		</>
	);
}
