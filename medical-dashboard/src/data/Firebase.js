// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgMRxiVV_2iowWVkDsY8fkp7y0e2RFdP8",
  authDomain: "cattleproject-fbb10.firebaseapp.com",
  databaseURL: "https://cattleproject-fbb10-default-rtdb.firebaseio.com",
  projectId: "cattleproject-fbb10",
  storageBucket: "cattleproject-fbb10.firebasestorage.app",
  messagingSenderId: "768619314652",
  appId: "1:768619314652:web:e80fd23c7c8f3910e5a319",
  measurementId: "G-LV356WJ9ZE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app)

export { db };