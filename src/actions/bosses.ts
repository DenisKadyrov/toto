import axios from "axios";

export async function getSubordinates() {
    try {
        const response = await axios.get("/api/users/bosses")
        return response
    } catch {
        console.log("wrong");
    }
}