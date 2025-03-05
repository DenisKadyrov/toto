import React from "react";
import TaskForm from "@/components/TaskForm"


const Modal = ({ isOpen, onClose, title, initValues, setInit, type}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-5 relative animate-fadeIn">
                {/* Title & Close Button */}
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✖
                    </button>
                </div>

                {/* Modal Content */}
                <div className="mt-4">
					<TaskForm initValues={initValues} setInit={setInit} type={type}/>
				</div>
            </div>
        </div>
    );
};

export default Modal;
