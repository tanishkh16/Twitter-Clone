import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCMNJ4DAeXOGcoArZ9HFF2STWXL6XICJPk",
  authDomain: "twitter-clone-507bc.firebaseapp.com",
  projectId: "twitter-clone-507bc",
  storageBucket: "twitter-clone-507bc.appspot.com",
  messagingSenderId: "459514925515",
  appId: "1:459514925515:web:2d008256eb507092fe664e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {db,auth};
