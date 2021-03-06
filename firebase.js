import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage'

var firebaseConfig = {
    apiKey: "AIzaSyBa--bg9-LoBToy8OBTS_pXhrn58VdLpNg",
    authDomain: "bythebookthebible.firebaseapp.com",
    databaseURL: "https://bythebookthebible.firebaseio.com",
    projectId: "bythebookthebible",
    storageBucket: "bythebookthebible.appspot.com",
    messagingSenderId: "45489637137",
    appId: "1:45489637137:web:0d91a0788e90356d3c6eb0"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore()
var storage = firebase.storage()
var functions = firebase.functions()
var auth = firebase.auth()

export { firebase, db, storage, functions, auth }