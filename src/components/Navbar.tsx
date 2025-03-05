"use client";
import React from "react";

import Button from "./ui/Button";


const Navbar = ({onclickFunc}) => {
  return (
    <nav className="w-full bg-gray-900 text-white px-6 py-3 flex items-center justify-end">
      <Button onClick={onclickFunc}>
        Create Task
      </Button>
    </nav>
  );
};

export default Navbar;
