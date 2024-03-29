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
import { API_ENDPOINT } from "../utils";



const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    

    // function logIn(email, password, loginAttempt, time) {
    //     var nowtime = Date.now();
    //     console.log("your account", nowtime - time);
    //     console.log("lofin", loginAttempt)
    
    
    //     if (parseInt(loginAttempt, 10) >= 4) {
    //         if (nowtime - time < 3600000) {
    //             console.log("HIII");
    //             navigate("/login");
    //             alert("Your account has been blocked for 1 hour. Please try again later.");
    //         } else{
    //             alert("Your account has been un blocked. Please try again.")
    //             return signInWithEmailAndPassword(auth, email, password)
    //             .then(() => {
    //                 console.log("Authentication successful.");
    //                 const editInfo = {
    //                     loginAttempt: "0",
    //                 };
    //                 return fetch(`${API_ENDPOINT}/userUpdates/${email}`, {
    //                     method: "PATCH",
    //                     headers: {
    //                         "Content-Type": "application/json"
    //                     },
    //                     body: JSON.stringify(editInfo)
    //                 });
    //             })
    //         }
    
            
    //     } else {
    //         console.log("I am here");
    //         return signInWithEmailAndPassword(auth, email, password)
    //             .then(() => {
    //                 console.log("Authentication successful.");
    //                 const editInfo = {
    //                     loginAttempt: "0",
    //                 };
    //                 return fetch(`${API_ENDPOINT}/userUpdates/${email}`, {
    //                     method: "PATCH",
    //                     headers: {
    //                         "Content-Type": "application/json"
    //                     },
    //                     body: JSON.stringify(editInfo)
    //                 });
    //             })
    //             .catch((err) => {
    //                 console.log("hello", loginAttempt);
    //                 console.error("Authentication failed:", err.message);
    //                 let updatedLoginAttempt = parseInt(loginAttempt, 10) + 1;
    //                 const editInfo = {
    //                     loginAttempt: updatedLoginAttempt.toString()
    //                 };
    //                 return fetch(`${API_ENDPOINT}/userUpdates/${email}`, {
    //                         method: "PATCH",
    //                         headers: {
    //                             "Content-Type": "application/json"
    //                         },
    //                         body: JSON.stringify(editInfo)
    //                     })
    //                     .then(() => {
    //                         if (updatedLoginAttempt >= 4) {
    //                             alert("Too many login attempts have been made. Your account has been blocked.");
    
    
    //                             const updatedTime = Date.now();
    //                             console.log("time", updatedTime);
    //                             const editInfo = {
    //                                 loginAttempt: updatedLoginAttempt.toString(),
    //                                 time: updatedTime
    //                             };
    
    //                             fetch(`${API_ENDPOINT}/userUpdates/${email}`, {
    //                                 method: "PATCH",
    //                                 headers: {
    //                                     "Content-Type": "application/json"
    //                                 },
    //                                 body: JSON.stringify(editInfo)
    //                             });
    //                             sendEmailNotification(email, {
    //                                 message: `You have made the maximum number of failed attempts. Your account has been blocked for 1 hour.`,
    //                             })
    //                         } else if (updatedLoginAttempt >= 2 && updatedLoginAttempt < 4) {
    //                             alert(`you have made ${updatedLoginAttempt} wrong attempts`);
    //                             sendEmailNotification(email, {
    //                                 message: ` You have done ${
    //                                   updatedLoginAttempt
    //                                 } consecutive failed login attempts with an incorrect password`,
    //                             });
    //                         }
    //                         throw err;
    //                     });
    //             });
    //     }
    // }
    
    function logIn(email, password, loginAttempt, time) {
        var nowtime = Date.now();
        console.log("your account", nowtime - time);
        console.log("login attempt", loginAttempt);
    
        if (parseInt(loginAttempt, 10) >= 4) {
            if (nowtime - time < 3600000) {
                console.log("Your account has been blocked for 1 hour. Please try again later.");
                alert("Your account has been blocked for 1 hour. Please try again later.");
                navigate("/login");
            } else {
                return Promise.resolve(signInWithEmailAndPassword(auth, email, password))
                    .then(() => {
                        console.log("Authentication successful.");
                        const editInfo = {
                            loginAttempt: "0",
                        };
                        return fetch(`${API_ENDPOINT}/userUpdates/${email}`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(editInfo)
                        });
                    })
                    .catch((err) => {
                        console.log("Authentication failed:", err);
                    });
            }
        } else {
            return Promise.resolve(signInWithEmailAndPassword(auth, email, password))
                .then(() => {
                    console.log("Authentication successful.");
                    const editInfo = {
                        loginAttempt: "0",
                    };
                    return fetch(`${API_ENDPOINT}/userUpdates/${email}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(editInfo)
                    });
                })
                .catch(async (err) => {
                    console.log("hello", loginAttempt);
                    console.error("Authentication failed:", err.message);
                    let updatedLoginAttempt = parseInt(loginAttempt, 10) + 1;
                    const editInfo = {
                        loginAttempt: updatedLoginAttempt.toString()
                    };
                    await fetch(`${API_ENDPOINT}/userUpdates/${email}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(editInfo)
                    });
                    if (updatedLoginAttempt >= 4) {
                        alert("Too many login attempts have been made. Your account has been blocked.");
                        const updatedTime = Date.now();
                        console.log("time", updatedTime);
                        const editInfo_1 = {
                            loginAttempt: updatedLoginAttempt.toString(),
                            time: updatedTime
                        };
    
                        fetch(`${API_ENDPOINT}/userUpdates/${email}`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(editInfo_1)
                        });
                        sendEmailNotification(email, {
                            message: `You have made the maximum number of failed attempts. Your account has been blocked for 1 hour.`,
                        });
                    } else if (updatedLoginAttempt >= 1 && updatedLoginAttempt < 4) {
                        alert(`you have made ${updatedLoginAttempt} wrong attempts`);
                        // Sending email notification
                        sendEmailNotification(email, {
                            message: ` You have done ${parseInt(loginAttempt) + 1} consecutive failed login attempts with an incorrect password`,
                        });
                    }
                    console.log("err", err);
                    throw err;
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
            console.log("Auth", currentuser);
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