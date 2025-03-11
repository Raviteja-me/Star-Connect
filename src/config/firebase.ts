import { initializeApp } from 'firebase/app';
    import { getAuth } from 'firebase/auth';
    import { getFirestore } from 'firebase/firestore';

    const firebaseConfig = {
      apiKey: "AIzaSyB--D7pQrmIgl5e6QZm8TRoc-9NEuZ6BKU",
      authDomain: "lazyowner-7571d.firebaseapp.com",
      databaseURL: "https://lazyowner-7571d-default-rtdb.firebaseio.com",
      projectId: "lazyowner-7571d",
      storageBucket: "lazyowner-7571d.firebasestorage.app",
      messagingSenderId: "361474077422",
      appId: "1:361474077422:web:e3c7c5075bd11ae8cf79ff",
      measurementId: "G-RTNJ2KRB5Y"
    };

    const app = initializeApp(firebaseConfig);

    // Check if Firebase is initialized correctly
    if (app) {
      console.log('Firebase initialized successfully!');
    } else {
      console.error('Firebase initialization failed!');
    }

    export const auth = getAuth(app);
    export const db = getFirestore(app);
