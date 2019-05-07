import 'firebase/firestore'
import app, {
  firestore
  } from 'firebase';
  let REACT_APP_API_KEY="AIzaSyBIUUMMawj-vmvr7XDIYrsxL9nLHybvtvs"
  let REACT_APP_AUTH_DOMAIN="comp585-health-policy.firebaseapp.com"
  let REACT_APP_DATABASE_URL="https://comp585-health-policy.firebaseio.com"
  let REACT_APP_PROJECT_ID="comp585-health-policy"
  let REACT_APP_STORAGE_BUCKET="comp585-health-policy.appspot.com"
  let REACT_APP_MESSAGING_SENDER_ID="473429604444"
  const config = {
      apiKey: REACT_APP_API_KEY,
      authDomain: REACT_APP_AUTH_DOMAIN,
      databaseURL: REACT_APP_DATABASE_URL,
      projectId: REACT_APP_PROJECT_ID,
      storageBucket: REACT_APP_STORAGE_BUCKET,
      messagingSenderId: REACT_APP_MESSAGING_SENDER_ID,
    };
  console.log(REACT_APP_API_KEY)
  app.initializeApp(config);
  let auth = app.auth();
  let db = firestore();
  db.collection('users').get().then(doc=>{
    doc.forEach(record=>{
      console.log(record.get('username'))
      console.log(record.get('isSick'))
      console.log(record.get('infectionString'))
    })
  })
  let jimmy = db.collection('users')
    .doc('bE5ewAxAKMNZ2o0mYMyg')
    .update({
      isSick:true,
      infectionString:"000000000"
    })
  let timmy = db.collection('users')
    .doc('bE5ewAxAKMNZ2o0mYMyg')
    .get()
    .then(record=>{
      console.log(record.get('username'))
    })
  console.log(timmy)
