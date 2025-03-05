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