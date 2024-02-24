import React, { useState } from "react";
import "./TweetBox.css";
import { Avatar, Button } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import axios from "axios";
import { useUserAuth } from "../../../context/UserAuthContext";
import useLoggedInUser from "../../../hooks/useLoggedInUser";
import { db } from "../../../context/firebase";
import { collection, getDoc, getDocs } from "firebase/firestore";
import { addDoc } from "firebase/firestore";
import { useEffect } from "react";
import firebase from "firebase/compat/app";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINT } from "../../../utils";
function TweetBox() {
    const [post, setPost] = useState([])
    const [imageURL, setImageURL] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [username, setUsername] = useState(' ');
    const [loggedInUser] = useLoggedInUser();
    const [userData,setUserData]=useState(null);
    const { user } = useUserAuth();
    const email = user?.email;
    const [buy,setBuy]=useState('');
    const [objectId, setObjectId] = useState('');
const navigate = useNavigate();



    const userProfilePic = loggedInUser[0]?.profileImage ? loggedInUser[0]?.profileImage : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"

    // console.log(user?.providerData[0]?.providerId);

    const handleUploadImage = e => {
        setIsLoading(true);
        const image = e.target.files[0];

        const formData = new FormData();
        formData.set('image', image)

        axios.post("https://api.imgbb.com/1/upload?key=c1e87660595242c0175f82bb850d3e15", formData)
            .then(res => {
                setImageURL(res.data.data.display_url);
                // console.log(res.data.data.display_url);
                setIsLoading(false)
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const handleTweet = async (e) => {
        e.preventDefault();
        // if (user?.providerData[0]?.providerId === 'password') {
        //     fetch(`${API_ENDPOINT}/loggedInUser?email=${email}`)
        //         .then(res => res.json())
        //         .then(data => {
        //             setName(data[0]?.name)
        //             setUsername(data[0]?.username)
        //             setBuy(data[0]?.plan)                 
        //         })
        // }
        // else {
          await fetch(`${API_ENDPOINT}/loggedInUser?email=${email}`)
                .then(res => res.json())
                .then(data => {
                    setName(data[0]?.name)
                    setUsername(data[0]?.username)
                    setBuy(data[0]?.plan)
                })

        // }
        if (name) {
            const userPost = {
                profilePhoto: userProfilePic,
                post: post,
                photo: imageURL,
                username: username,
                name: name,
                email: email,
                userid: objectId,
                date: new Date().toISOString().split('T')[0],
                
                }
                console.log(userPost);

            setPost('')
            setImageURL('')
            
            if(buy === "1"){
                await fetch(`${API_ENDPOINT}/userPost?email=${email}`)
                .then(res => res.json())
                .then( async (userPosts) => {
                    const today = new Date().toISOString().split('T')[0];
                    console.log(userPosts);
                    const userPostsToday = userPosts.filter(post => post.date === today);
                    if (userPostsToday.length >= 1) {
                        alert("Free plan allows only 1 tweet per day. Upgrade your plan to post more.");
                        navigate('/home/premium')
                    } else {
                        await fetch(`${API_ENDPOINT}/post` , {
                            method: "POST",
                            headers: {
                                'content-type': 'application/json'
                            },
                            body: JSON.stringify(userPost),
                        })
                        .then(res => res.json())
                        .then(data => {
                                console.log(data);
                            })
                    }
                })
                .catch(error => console.error(error));
            } else if (buy === "2") {
                
               await  fetch(`${API_ENDPOINT}/userPost?email=${email}`)
                .then(res => res.json())
                .then(userPosts => {
                    const today = new Date().toISOString().split('T')[0];
                    const userPostsToday = userPosts.filter(post => post.date === today);
                    if (userPostsToday.length >= 5) {
                        alert("Silver plan allows only 5 tweet per day. Upgrade your plan to post more.");
                        navigate('/home/premium')
                    } else {
                        fetch(`${API_ENDPOINT}/post`, {
                            method: "POST",
                            headers: {
                                'content-type': 'application/json'
                            },
                            body: JSON.stringify(userPost),
                        })
                            .then(res => res.json())
                            .then(data => {
                                console.log(data);
                            })
                    }
                })
                .catch(error => console.error(error));
            }else if (buy === "3") {
               await  fetch(`${API_ENDPOINT}/userPost?email=${email}`)
                .then(res => res.json())
                .then(userPosts => {
                        fetch(`${API_ENDPOINT}/post`, {
                            method: "POST",
                            headers: {
                                'content-type': 'application/json'
                            },
                            body: JSON.stringify(userPost),
                        })
                            .then(res => res.json())
                            .then(data => {
                                console.log(data);
                            })
                        })
                .catch(error => console.error(error));
            }
        
    }
    }
    return <div className="tweetBox">
        <form onSubmit={handleTweet}>
            <div className="tweetBox__input">
                <Avatar src={loggedInUser[0]?.profileImage ? loggedInUser[0]?.profileImage : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"} />
                <input
                    type="text"
                    placeholder="What's happening?"
                    onChange={(e) => setPost(e.target.value)}
                    value={post}
                    required
                />

            </div>
            <div className="imageIcon_tweetButton">
                <label htmlFor='image' className="imageIcon">
                    {
                        isLoading ? <p>Uploading Image</p> : <p>{imageURL ? 'Image Uploaded' : <AddPhotoAlternateOutlinedIcon />}</p>
                    }
                </label>
                <input
                    type="file"
                    id='image'
                    className="imageInput"
                    onChange={handleUploadImage}
                />
                <Button className="tweetBox__tweetButton" type="submit">Tweet</Button>
            </div>
        </form>

    </div>

}
export default TweetBox;