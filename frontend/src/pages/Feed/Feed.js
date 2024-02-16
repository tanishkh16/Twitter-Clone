import React, { useEffect, useState } from "react";
import Post from "./Post/Post";
import "./Feed.css";
import TweetBox from "./TweetBox/TweetBox";
import { db } from "../../context/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Avatar } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser"
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PublishIcon from "@mui/icons-material/Publish";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from "axios";
// import { get } from "mongoose";




function Feed() {
    const [posts, setPosts] = useState([]);
    

    useEffect(() => {
        fetch('http://localhost:5000/post')
            .then(res => res.json())
            .then(data => {
                setPosts(data);
            })
           

    }, [posts])

    // useEffect(() => {
    //     const fetchUserData=async()=>{
    //         const result = await getDocs(collection(db, "users"));
    //     const usersArray = [];
    //     result.forEach((doc) => {
    //       usersArray.push(doc.data());
    //     });
          
    //       usersArray.sort((a, b) => {
    //         const timestampA = new Date(a.timestamp).getTime();
    //         const timestampB = new Date(b.timestamp).getTime();
    //         return timestampB - timestampA; // descending order
    //     });

    //       setPosts(usersArray);
    //       // console.log(usersArray);

    //     }
    //     fetchUserData();
    // },[posts])

    // useEffect(() => {
    //   const getPosts = async () => {
    //     try {
    //       const response = await axios.get('http://localhost:5000/post', {
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //       });
      
    //       console.log(response.data);
    //     } catch (error) {
    //       console.error('Error fetching posts:', error.message);
    //     }
    //   };
    //   // getPosts();

    // },[posts])

    // Get the current URL


  

   

    return (
        <div className="feed">
            <div className="feed__header">
                <h2>Home</h2>
            </div>
            <TweetBox />
{
            posts.map((item) => (
            <div className="post">
      <div className="post__avatar">
        <Avatar src={item.profilePhoto} />
      </div>
      <div className="post__body">
        <div className="post__header">
          <div className="post__headerText">
            <h3>
                {item.name}{" "}
              <span className="post__headerSpecial">
                <VerifiedUserIcon className="post__badge" /> @{item.username}
              </span>
            </h3>
          </div>
          <div className="post__headerDescription">
            <p>{item.post}</p>
          </div>
        </div>
        <img src={item.photo} alt="" width='500' />
        
        <div className="post__footer">
          <ChatBubbleOutlineIcon className="post__footer__icon" fontSize="small" />
          <RepeatIcon className="post__footer__icon" fontSize="small" />
          <FavoriteBorderIcon className="post__footer__icon" fontSize="small" />
          <PublishIcon className="post__footer__icon" fontSize="small" />
        </div>
      </div>
    </div>
            ))}
           
        </div>

    )

}

export default Feed