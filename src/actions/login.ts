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