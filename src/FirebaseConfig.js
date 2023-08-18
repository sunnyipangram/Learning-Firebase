
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import{getAuth,GoogleAuthProvider} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCUVrkD5hOIBKk07D3Wgyi_OHIN_kuRNWA",
  authDomain: "fir-frontend-acd46.firebaseapp.com",
  projectId: "fir-frontend-acd46",
  storageBucket: "fir-frontend-acd46.appspot.com",
  messagingSenderId: "724027592718",
  appId: "1:724027592718:web:8a1f991559875b96e4ec5f",
  measurementId: "G-JDTRNBCBDB"
};


export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth=getAuth(app);
export const googleProvider=new GoogleAuthProvider()

export const db=getFirestore(app);