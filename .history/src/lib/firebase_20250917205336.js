// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4az6E8usMk1oOxHE9614r9YvUwcO8aSQ",
  authDomain: "el-rincon-de-martin-2814d.firebaseapp.com",
  projectId: "el-rincon-de-martin-2814d",
  storageBucket: "el-rincon-de-martin-2814d.firebasestorage.app",
  messagingSenderId: "784748385530",
  appId: "1:784748385530:web:a8d1ed439cb373642ea543",
  measurementId: "G-RY8YDM2V80"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
