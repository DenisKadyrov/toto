"use client";
import Link from "next/link";
import SignupForm from "@/components/SignupForm";

export default function SignupPage() {
	

	return (
		<>
			<div className="flex h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<p className="mx-auto h-10 w-auto flex justify-center items-center font-black text-blue-500 text-2xl">
						TodoApp
					</p>
					<h2 className="mt-5 text-center text-2xl font-medium leading-9 tracking-tight text-black">
						Sign in to your account
					</h2>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<SignupForm />

					<p className="mt-10 text-center text-sm text-gray-500">
						already a member? &nbsp;
						<Link
							href="/login"
							className="font-semibold leading-6 text-blue-600 hover:text-blue-400"
						>
							log in now
						</Link>
					</p>
				</div>
			</div>
		</>
	);
}
