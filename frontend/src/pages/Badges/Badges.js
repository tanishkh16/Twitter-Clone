import React from 'react'
import { useState,useEffect } from 'react';
import './Badges.css';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useUserAuth } from "../../context/UserAuthContext";
import useLoggedInUser from '../../hooks/useLoggedInUser';
import { API_ENDPOINT } from '../../utils';



export default function  () {
    const [name, setName] = useState('');
    const [username, setUsername] = useState(' ');
    const [badge, setBadge] = useState(' ');
    const [profession, setProfession] = useState(' ');
    const [badgeStatus, setBadgeStatus] = useState(false);
    const { user } = useUserAuth();
    const email = user?.email;
    const [loggedInUser, setLoggedInUser] = useState({});

console.log('email', email)
    // useEffect(() => {
    //     fetch(`http://localhost:5000/loggedInUser?email=${email}`)
    //         .then(res => res.json())
    //         .then(data => {
    //             console.log('data', data)
    //         })
    //         .catch(error => {
    //           console.error('Error fetching user data:', error);
    //         });
    // }, [])


    useEffect(() => {
      const getUserInfo = async () => {
        try {
          const res = await axios.get(`${API_ENDPOINT}/loggedInUser?email=${email}`, {
            headers: {
              "Content-Type": "application/json"
            }
          });
  
          // Handle the user data received from the backend
          const userData = res.data;
          console.log(userData);
          setBadgeStatus(userData[0].badge);
          setName(userData[0].name);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      getUserInfo();
    }, [badgeStatus, email]); 
    
    console.log('badge', badgeStatus);
 

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(name, username, profession);
        setName('');
        setUsername('');
        setProfession('');
    }
  
      
   

    const makePayment = async (e) => {
        e.preventDefault();
        console.log("Payment");
        const stripe=await loadStripe("pk_test_51OHAA3SETXDcTTgLUwK8fSYVlPr1gnzOSED8Ox0ioJqehQXE2YC2t4LFl4QKaaq7T5senm4hpDrVlFp3vMzLjRdk006KGh5J9e")
      try{
        const response = await axios.post(`${API_ENDPOINT}/badge`, {
          userID: loggedInUser,
          email: email,
      }, {
          headers: {
              "Content-Type": "application/json"
          },
          mode: "cors"
      });
          console.log(response.data);
         
          const result=await stripe.redirectToCheckout({
              sessionId:response.data.id
          })
          
          if(result.error){
              alert(result.error.message);
          }

      }catch(error){
        console.log('error');

      }
       
        
         
    }
  return (
    <div className="badge-container">
      
    {badgeStatus ? (
      <h2>Already have a Verification badge</h2>
    ) : (
      <>
              <form className='form' onSubmit={handleSubmit}>
        <h2>Apply for Verification Badge</h2>
       <br/>
       <br/>
       <br/>
       <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          </div>
          <div className="form-group">
  
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          </div>
          <div className="form-group">
  
          <label htmlFor="profession">Profession:</label>
          <input
            type="text"
            id="profession"
            name="profession"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            required
          />
          </div>
  
          <button className="apply-button" onClick={makePayment} type="submit">Pay 299 RS.</button>
        </form>
      </>
    )}
  </div>
  
  );
};
  
