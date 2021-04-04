import firebase from 'firebase';
const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGE_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};

const FirebaseApp = firebase.initializeApp(config);
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();
const db = FirebaseApp.firestore();

export { auth, googleProvider, db };