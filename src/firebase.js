import firebase from "firebase/app";
import "firebase/app";
import "firebase/database";
import "firebase/auth";

var config = {
  apiKey: "AIzaSyBDU4XUlBQnixEF4TrJZq_5sJoEbkmV3ew",
  authDomain: "heritage-45acb.firebaseapp.com",
  databaseURL: "https://heritage-45acb.firebaseio.com",
  projectId: "heritage-45acb",
  storageBucket: "heritage-45acb.appspot.com",
  messagingSenderId: "911242211563"
};

firebase.initializeApp(config);

const firebaseDB = firebase.database();

const firebaseChorus = firebaseDB.ref("chorus");

const firebaseCgs = firebaseDB.ref("cgs");

const firebaselocation = firebaseDB.ref("location");

const firebaseStudy = firebaseDB.ref("study");

const firebaseTract = firebaseDB.ref("tract");

const firebaseAdult = firebaseDB.ref("adult");

const firebaseElem = firebaseDB.ref("elem");

const firebaseJunior = firebaseDB.ref("junior");

export {
  firebase,
  firebaseDB,
  firebaseChorus,
  firebaseCgs,
  firebaselocation,
  firebaseAdult,
  firebaseTract,
  firebaseJunior,
  firebaseElem,
  firebaseStudy
};
