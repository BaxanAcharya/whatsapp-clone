import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyA5520uiXA4W0YJ2_AV--vCDliP8hFUkCY",
  authDomain: "friendssms-6e074.firebaseapp.com",
  databaseURL: "https://friendssms-6e074.firebaseio.com",
  projectId: "friendssms-6e074",
  storageBucket: "friendssms-6e074.appspot.com",
  messagingSenderId: "56271201900",
  appId: "1:56271201900:web:a98343801e6923c2f09a49",
  measurementId: "G-M3DLBS6HG1",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
