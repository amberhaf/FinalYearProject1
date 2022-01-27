import firebase from "firebase/app"
import "firebase/auth"
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAnayCCFR5xIO8A75Op3fQd5sRUVYsiyXk",
  authDomain: "careerpathplanner-d5ad3.firebaseapp.com",
  projectId: "careerpathplanner-d5ad3",
  storageBucket: "careerpathplanner-d5ad3.appspot.com",
  messagingSenderId: "923827726708",
  appId: "1:923827726708:web:099575d8d4487ee58d2421",
}


firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth;
export const datab = firebase.firestore();
