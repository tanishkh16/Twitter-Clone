import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { auth } from "./firebase";
import { sendEmailNotification } from "./UserEmail";
import { useNavigate } from "react-router-dom";
    


const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    

    function logIn(email, password, loginAttempt, time) {
        var nowtime = Date.now();
        console.log("your account",nowtime-time);
        console.log("lofin",loginAttempt)
    
        if (loginAttempt >= 4) {
            if (nowtime - time < 3600000) {
                console.log("HIII");
                navigate("/login");
                alert("Your account has been blocked for 1 hour. Please try again later.");
            } else {
                const editedInfo = {
                    loginAttempt: "0",
                };
                console.log(editedInfo);
        
                fetch(`http://localhost:5000/userUpdates/${email}`, {
                    method: "PATCH",
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(editedInfo),
                });
            
            }
        } else {
            console.log("I am here");
            return signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    console.log("Authentication successful.");
                    const editInfo = {
                        loginAttempt: "0",
                    };
                    return fetch(`http://localhost:5000/userUpdates/${email}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(editInfo)
                    });
                })
                .catch((err) => {
                    console.log("hello", loginAttempt);
                    console.error("Authentication failed:", err.message);
                    let updatedLoginAttempt = parseInt(loginAttempt, 10) + 1;
                    const editInfo = {
                        loginAttempt: updatedLoginAttempt
                    };
                    return fetch(`http://localhost:5000/userUpdates/${email}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(editInfo)
                    })
                    .then(() => {
                        if (updatedLoginAttempt >= 4) {
                            // sendEmailNotification(email, {
                            //     message: ` You have done maximum failed attempts. Your account has been blocked for 1 hour.`,
                            //   });
                            alert("Too many login attempts has done. Your account has been blocked.")
        
                            const updateTime=Date.now();
                            console.log("time",updateTime);
                            const editInfo={
                                loginAttempt:updatedLoginAttempt,
                                time:updateTime
                            }
                            return fetch(`http://localhost:5000/userUpdates/${email}`, {
                                method: "PATCH",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(editInfo)
                            })
                        } else if (updatedLoginAttempt >= 2 && updatedLoginAttempt < 4) {
                            alert(`you have made ${updatedLoginAttempt} wrong attempts`);
                            // sendEmailNotification(email, {
                            //     message: ` You have done ${
                            //       loginAttempt + 1
                            //     } consecutive failed login attempts with an incorrect password`,
                            //   });
        
                        }
                        throw err;
                    });
                });
        }
    }
    
    
    function signUp(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }
    function logOut() {
        return signOut(auth);
    }
    function googleSignIn() {
        const googleAuthProvider = new GoogleAuthProvider();
        return signInWithPopup(auth, googleAuthProvider);
    }

    useEffect(() => {
     const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
            console.log("Auth", currentuser.email);
            setUser(currentuser);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <userAuthContext.Provider
            value={{ user, logIn, signUp, logOut, googleSignIn }}
        >
            {children}
        </userAuthContext.Provider>
    );
}

export function useUserAuth() {
    return useContext(userAuthContext);
}