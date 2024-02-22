import axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useParams} from 'react-router-dom';
import { API_ENDPOINT } from '../../utils';


export default function Payment() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');
const decodedEmail = email ? decodeURIComponent(email) : null;
console.log("e",decodedEmail);




    const donePayment = async () => {
        try {
            const res = await axios.put(`${API_ENDPOINT}/update-badge?email=${encodeURIComponent(email)}`, { email: decodedEmail },
              {
                headers: {
                  "Content-Type": "application/json"
                }
              })
            console.log(res);
            navigate('/badge');
        }
        catch (error) {
            console.log(error);
        }
    }
useEffect(() => {
    donePayment()
},[])
    

    

  return (
    <div>
    </div>
  )
}
