import React from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
    const { user } = useUserAuth();

   console.log("user",user)

            if (!user) {
                return <Navigate to="/login" />;
            }
        return children;
};

export default ProtectedRoute;