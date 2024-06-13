
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

export const firebaseConfig = {
  apiKey: "AIzaSyARfh3jlV06N4X84OAWUaBos4BirZuIUCA",
  authDomain: "test1-59d1e.firebaseapp.com",
  projectId: "test1-59d1e",
  storageBucket: "test1-59d1e.appspot.com",
  messagingSenderId: "860913990262",
  appId: "1:860913990262:web:48789a8094e7453730bd57",
  measurementId: "G-L3CQFTQBM0"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);