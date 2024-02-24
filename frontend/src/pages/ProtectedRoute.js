import React from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
    const { user } = useUserAuth();


            if (!user) {
            }
        return children;
};

export default ProtectedRoute;