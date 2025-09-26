import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCYdXGG-hhK7_X2RVnFEx3xaCUJCnRNeeY",
    authDomain: "quizify-y59nz.firebaseapp.com",
    projectId: "quizify-y59nz",
    storageBucket: "quizify-y59nz.appspot.com",
    messagingSenderId: "621024988130",
    appId: "1:621024988130:web:1aa1ec2f831f3aac26c7bb"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);
