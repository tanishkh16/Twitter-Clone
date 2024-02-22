import React, { useEffect } from 'react'
import axios from 'axios'
import { useUserAuth } from "../../context/UserAuthContext";
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import "./Premium.css";
import { API_ENDPOINT } from '../../utils';


export default function Premium() {
    const { user } = useUserAuth();
    const [aplan, setAplan] = useState('');
    const email = user?.email;
    console.log('email', email);
    
    useEffect(() => {
        if (email) {
            fetch(`${API_ENDPOINT}/loggedInUser?email=${email}`)
                .then((res) => res.json())
                .then((data) => {
                    setAplan(data[0]?.plan);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [email,aplan]); // Include email in the dependency array
    
    
      console.log("plan",aplan);

      const makePaymentSilver = async (e) => {
        try {
            const stripe = await loadStripe("pk_test_51OHAA3SETXDcTTgLUwK8fSYVlPr1gnzOSED8Ox0ioJqehQXE2YC2t4LFl4QKaaq7T5senm4hpDrVlFp3vMzLjRdk006KGh5J9e");
            const res = await fetch(`${API_ENDPOINT}/create-checkout-session-silver`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                
                body: JSON.stringify({ plan: "Silver Plan" }),
            });
    
            const data = await res.json();
    
            if (data.error) {
                console.log(data.error.message);
                // Handle error, maybe show it to the user
            } else {
                const editedInfo = {
                    plan: "2",
                };
    
                // Fetch PATCH request
                const patchRes = await fetch(`${API_ENDPOINT}/userUpdates/${user?.email}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(editedInfo),
                });
    
                // Ensure PATCH request is successful
                if (patchRes.ok) {
                    window.location=data.url;
                    console.log("User plan updated successfully.");
                } else {
                    console.error("Failed to update user plan.");
                }
            }
            // window.location.reload();

        } catch (err) {
            console.error('Error:', err);
            // Handle error, maybe show it to the user
        }
    };
    
    
      const makePaymentGold = async () => {
        try {
            const stripe = await loadStripe("pk_test_51O4hY9SAFIUZ4HpWQqIARd8Q3473PlKvRT4hJPcpRhpRYt1zgIObxZnbSF5SIY1gj6PV8oTMIRukMOlRVZekFi3l00fu3xrjla");
            const res = await fetch(`${API_ENDPOINT}/create-checkout-session-gold`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ plan: "Gold Plan" }),
            });
    
            const data = await res.json();
    
            if (data.error) {
                console.log(data.error.message);
                // Handle error, maybe show it to the user
            } else {
                const editedInfo = {
                    plan: "3",
                };
    
                // Fetch PATCH request
                const patchRes = await fetch(`${API_ENDPOINT}/userUpdates/${user?.email}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(editedInfo),
                });
    console.log(patchRes);
    console.log("hh",data.url);
                // Ensure PATCH request is successful
                if (patchRes.ok) {
                    console.log("User plan updated successfully.");
                    window.location=data.url
                } else {
                    console.error("Failed to update user plan.");
                }
            }
            // window.location.reload();

        } catch (err) {
            console.error('Error:', err);
            // Handle error, maybe show it to the user
        }
    }
    console.log(aplan);    
    
    
  return (
    <div className="subscriptions-container">
    {aplan === "1" ? (
    <>
        <h2>You are on Free Plan. Upgrade now.</h2>
        <div className="plan-card" onClick={makePaymentSilver}>
            <h3>Silver Plan</h3>
            <p>₹100/month</p>
            <p>Tweets Per Day: 5</p>
        </div>
        <div className="plan-card" onClick={makePaymentGold}>
            <h3>Gold Plan</h3>
            <p>₹1000/month</p>
            <p>Tweets Per Day: Unlimited</p>
        </div>
    </>
) : aplan === "2" ? (
    <>
        <h2>You are on Silver Plan. Upgrade now.</h2>
        <div className="plan-card" onClick={makePaymentGold}>
            <h3>Gold Plan</h3>
            <p>₹1000/month</p>
            <p>Tweets Per Day: Unlimited</p>
        </div>
    </>
) : aplan === "3" ? (
    <h2>You are on Gold Plan. Enjoy!!</h2>
) : (
    <h2></h2>
)}

  </div>
  )
  }

