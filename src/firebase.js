import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
	apiKey: "AIzaSyCzz4ale262B0ffyquRhQ12RjSGYjtDDBM",
	authDomain: "instagram-clone-a5b52.firebaseapp.com",
	databaseURL: "https://instagram-clone-a5b52.firebaseio.com",
	projectId: "instagram-clone-a5b52",
	storageBucket: "instagram-clone-a5b52.appspot.com",
	messagingSenderId: "183590381717",
	appId: "1:183590381717:web:2f171e2ed5d0001613139c",
	measurementId: "G-99XT8P0PNE",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const stroge = firebase.storage();

export { db, auth, stroge };
