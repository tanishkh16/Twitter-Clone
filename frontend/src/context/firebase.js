// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBdkGomNqWSSI-gj2a6z89_60xoxiWewu8",
  authDomain: "tweet-fb439.firebaseapp.com",
  projectId: "tweet-fb439",
  storageBucket: "tweet-fb439.appspot.com",
  messagingSenderId: "899332050563",
  appId: "1:899332050563:web:d5f07590c20dc4141a55b6"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {db,auth};