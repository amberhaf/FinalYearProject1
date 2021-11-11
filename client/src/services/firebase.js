import firebase from "firebase";
require('firebase/firestore');
const config = {
  apiKey: "AIzaSyAnayCCFR5xIO8A75Op3fQd5sRUVYsiyXk",
  authDomain: "careerpathplanner-d5ad3.firebaseapp.com",
  databaseURL: "https://careerpathplanner-d5ad3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "careerpathplanner-d5ad3",
  storageBucket: "careerpathplanner-d5ad3.appspot.com",
  messagingSenderId: "923827726708",
  appId: "1:923827726708:web:099575d8d4487ee58d2421",
  measurementId: "G-5V05PBDTVS"
};

firebase.initializeApp(config);

export const auth = firebase.auth;
//export const db = firebase.database();
export const storage = firebase.storage();

export const storageKey = 'KEY_FOR_LOCAL_STORAGE';
export const datab = firebase.firestore();
export const firebaseAuth = firebase.auth;
