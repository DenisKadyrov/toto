"use client";
import Link from "next/link";
import {useRouter} from "next/navigation";
import axios from "axios";
import {useFormik} from "formik";
import * as yup from "yup";
import LoginForm from "@/components/LoginForm";

//ToDo Some Error Check not working properly in if else cases handle later



export default function LoginPage() {
	const router = useRouter();
	const {toast} = useToast();
	const {isLoading: loginLoading, setIsLoading: setLoginLoading} = useTodos();
	const {isLoading: guestLoading, setIsLoading: setGuestLoading} = useTodos();

	const onLogin = async (values: any) => {
		try {
			setLoginLoading(true);
			const response = await axios.post("/api/users/login", values);
			const responseData = response.data;
			if (!responseData.error) {
				// No error, redirect to home page
				router.push("/");
				toast({title: responseData.message});
			}
		} catch (error: any) {
			// Handle network errors or other exceptions
			const errorMessage =
				error.response?.data?.error || "An error occurred during login.";

			toast({title: errorMessage});
		} finally {
			setLoginLoading(false);
		}
	};

	const guestLogin = async () => {
		setValues({email: "Jayeshgadhok@gmail.com", password: "Jayesh@1996"});
		try {
			setGuestLoading(true);
			const response = await axios.post("/api/users/login", {
				email: "Jayeshgadhok@gmail.com",
				password: "Jayesh@1996",
			});
			const responseData = response.data;
			if (!responseData.error) {
				router.push("/");
				toast({title: responseData.message});
			}
		} catch (error: any) {
			const errorMessage =
				error.response?.data?.error || "An error occurred during guest login.";
			toast({title: errorMessage});
			console.error("An error occurred during guest login:", error);
		} finally {
			setGuestLoading(false);
			resetForm();
		}
	};

	const {
		handleSubmit,
		values,
		handleChange,
		errors,
		touched,
		setFieldTouched,
		isValid,
		isSubmitting,
		setValues,
		resetForm,
	} = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: userSchema,
		onSubmit: async (values, {resetForm}) => {
			if (isValid) {
				await onLogin(values);
				resetForm();
			}
		},
	});

	const handleTouched = (field: string) => {
		setFieldTouched(field, true);
	};

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
