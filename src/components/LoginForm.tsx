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