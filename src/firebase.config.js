// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyASThPcel-zqrcgydpFcPTbt3RKA0Q5YUU",
    authDomain: "house-marketplace-app-57d3a.firebaseapp.com",
    projectId: "house-marketplace-app-57d3a",
    storageBucket: "house-marketplace-app-57d3a.appspot.com",
    messagingSenderId: "126693855326",
    appId: "1:126693855326:web:7b9c895814e770267ca4cf"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

initializeApp(firebaseConfig)

const db = getFirestore()

export { db }