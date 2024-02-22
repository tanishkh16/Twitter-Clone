import { useEffect, useState } from "react";
import { useUserAuth } from "../context/UserAuthContext";
import { API_ENDPOINT } from "../utils";

const useLoggedInUser = () => {
    const { user } = useUserAuth();
    const email = user?.email;
    const [loggedInUser, setLoggedInUser] = useState({});

    useEffect(() => {
        
        fetch(`${API_ENDPOINT}/loggedInUser?email=${email}`)
            .then(res => res.json())
            .then(data => {
                setLoggedInUser(data[0]._id)
            })
    }, [email, loggedInUser])

    return [loggedInUser, setLoggedInUser];
}

export default useLoggedInUser