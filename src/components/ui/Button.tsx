import React from "react";


export default function Button({children, buttonType, ...props}) {
    return (
        <>
            <button
                {...props}
                className={`cursor-pointer flex items-center gap-2 justify-center rounded-md ${(buttonType === "Delete") ? "bg-red-600": "bg-blue-600"} px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`} >
                {children}
            </button>
        </>
    );
}