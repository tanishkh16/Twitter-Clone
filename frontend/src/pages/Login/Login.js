import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleButton from "react-google-button";
import { useUserAuth } from "../../context/UserAuthContext";
import twitterimg from "../../image/twitter.jpeg";
import TwitterIcon from '@mui/icons-material/Twitter';
import "./Login.css";
import axios from "axios";
import { useEffect } from "react";
import { API_ENDPOINT } from "../../utils";


const Login = () => {
    const [email, setEmail] = useState("");
    const [userName,setUserName]=useState("");
    const[name,setName]=useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { logIn, googleSignIn } = useUserAuth();
    const [loginAttempt,setLoginAttempt]=useState("")
    const navigate = useNavigate();
    const [time, setTime] = React.useState("");
    const { user } = useUserAuth();

    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
      }
    useEffect(() => {
      fetch(
        `${API_ENDPOINT}/loggedInUser?email=${email}`
      )
        .then((res) => res.json())
        .then((data) => {
          setLoginAttempt(data[0]?.loginAttempt);
          setTime(data[0]?.time);
        });
    }, [loginAttempt, email, time]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res=await logIn(email, password, loginAttempt, time);
            // console.log(res);
            if(!isEmpty(user)){
                navigate("/");
            }
            else{
                navigate("/login");
                window.location.reload();
            }
        } catch (err) {
            if (err !== undefined && err !== null) {
                console.log(err);
                setError(err);
                window.alert(err);
            }
            
            setEmail("");
            setPassword("");
        
            window.location.reload();
            navigate("/login");
            
        }
    };
    

    const handleGoogleSignIn = async (e) => {
        e.preventDefault();
        try {
            await googleSignIn();
            const idToken=await googleSignIn();
            // const decodedToken=jwtDecode(idToken);
            // console.log(decodedToken);

            const res=axios.post(`${API_ENDPOINT}/login`,{userId:idToken},{
                headers:{
                    "Content-Type":"application/json"
                }
            })
           
            
            navigate("/");
        } catch (error) {
            console.log(error.message);
        }
    };


    return (
        <>




            <div className="login-container">
                <div className="image-container">
                    <img className=" image" src={twitterimg} alt="twitterImage" />
                </div>

                <div className="form-container">
                    <div className="form-box" >
                        <TwitterIcon style={{ color: "skyblue" }} />
                        <h2 className="heading">Happening now</h2>

                        {error && <p>{error.message}</p>}
                        <form onSubmit={handleSubmit}>

                            <input
                                type="email" className="email"
                                placeholder="Email address"
                                onChange={(e) => setEmail(e.target.value)}
                            />



                            <input className="password"
                                type="password"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                            />


                            <div className="btn-login">
                                <button type="submit" className="btn" >Log In</button>
                            </div>
                        </form>
                        <hr />
                        <div>
                            <GoogleButton

                                className="g-btn"
                                type="light"

                                onClick={handleGoogleSignIn}
                            />


                        </div>
                    </div>
                    <div>
                        Don't have an account?
                        <Link
                            to="/signup"
                            style={{
                                textDecoration: 'none',
                                color: 'var(--twitter-color)',
                                fontWeight: '600',
                                marginLeft: '5px'
                            }}
                        >
                            Sign up
                        </Link>
                    </div>

                </div>


            </div>


        </>
    );
};

export default Login;