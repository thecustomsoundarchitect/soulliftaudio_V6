import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAy_j8eY964GwySbwz8Ixhqr4Uwq-2ijhI",
  authDomain: "emotional-978ec.firebaseapp.com",
  projectId: "emotional-978ec",
  storageBucket: "emotional-978ec.appspot.com",
  messagingSenderId: "310774535075",
  appId: "1:310774535075:web:1e6fd614d3dfde11e1c016",
  measurementId: "G-LF4GE0RZT9"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
