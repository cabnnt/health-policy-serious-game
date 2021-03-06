import app, {
  firestore
} from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';

// import firestore from 'firebase/firebase-firestore';
import FirebaseContext, {
  withFirebase
} from './context';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};
export default class Firebase {

  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = firestore();
  }

  async fetchUserFromFirestore(email) {
    if (!email) {
      return null;
    }

    let user = null;
    let response = await this.db
      .collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();
    
    response.forEach(user_record => {
      user = { id: user_record.id, ...user_record.data() };
    });
    
    return user;
  }

  async createGame(params) {
    return await this.db.collection('games').add({
      name : params.name,
      createdAt: firestore.Timestamp.fromDate(new Date()),
      roundTime : params.roundTime,
      numberOfDoctors: params.numberOfDoctors,
      minorTreatmentCost:params.minorCost,
      majorTreatmentCost:params.majorCost
    });
  }

  createUser = (role, username, email, password) => {
    this.auth.createUserWithEmailAndPassword(email, password);
    const currentGame = null;
    return this.db.collection('users').add({
      role,
      username,
      email,
      currentGame
    });
  }
  signIn = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  signOut = () => this.auth.signOut();

  resetPassword = (email) => this.auth.sendPasswordResetEmail(email);

  updatePassword = (password) => this.auth.currentUser.updatePassword(password);
}

export {
  FirebaseContext,
  withFirebase
};