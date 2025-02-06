import { initializeApp } from "firebase/app";
import { ServiceContainer } from "./service/service-container";

const firebaseConfig = {
  apiKey: "AIzaSyCxr5Z5kJ_jSatKWwpeZq8bzeiIt7vgH_g",
  authDomain: "boilermarket-6d363.firebaseapp.com",
  projectId: "boilermarket-6d363",
  storageBucket: "boilermarket-6d363.firebasestorage.app",
  messagingSenderId: "478895467699",
  appId: "1:478895467699:web:8ccb8de0db43defa0514c6",
  measurementId: "G-1M3BL3H1CT"
};

export const app = initializeApp(firebaseConfig);
ServiceContainer.initialize(app);