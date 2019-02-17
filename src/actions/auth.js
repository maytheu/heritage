import { firebase } from "../firebase";
import { LOGIN_USER } from "./types";

export const signIn = ({ email, password }) => dispatch => {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(response => {
      dispatch({
        type: LOGIN_USER,
        payload: response.user
      })
    })
    .catch(err => {
      dispatch({
        type: LOGIN_USER,
        payload: err
      })
    })
};

  export const signOut = () => {
    firebase.auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
      })
      .catch(error => {
        console.log(error);
      });
  };