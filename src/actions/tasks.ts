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

export const updateTask = async (values: any) => {
    try {
        await axios.patch("/api/tasks", values)
    } catch (error: any) {
        console.log("I'm not OK!")
    }
}