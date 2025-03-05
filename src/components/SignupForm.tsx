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