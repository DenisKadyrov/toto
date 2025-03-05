import axios from "axios";

export async function getUsers() {
    try {
        const response = await axios.get("/api/users");
        return response
    } catch {
        console.log("any");
    }
}