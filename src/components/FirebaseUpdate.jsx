import CircularProgressBar from './CircularProgressBar';
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import './FirebaseUpdate.css';
import Table from './table';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcPA8tGfwVMn-gvg_cqKErphQoFCTI3FA",
  authDomain: "tdsturbulity.firebaseapp.com",
  databaseURL: "https://tdsturbulity-default-rtdb.firebaseio.com/",
  projectId: "tdsturbulity",
  storageBucket: "sensor.appspot.com",
  messagingSenderId: "1041817110194",
  appId: "1:1041817110194:web:abcdef12345678",
  databaseToken: "eROsAnukV0usBWgMIhYKvnUmKmHUUs8mJe4enOCl"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

const FirebaseUpdate = () => {
  const [TDS, setTDS] = useState(null);
  const [turbidity, setTurbidity] = useState(null);
  const [isTableVisible, setIsTableVisible] = useState(true); // State to toggle table visibility

  // Load saved data from LocalStorage
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('data')) || [];
    if (savedData.length > 0) {
      setTDS(savedData[savedData.length - 1]?.tds);
      setTurbidity(savedData[savedData.length - 1]?.turbidity);
    }
  }, []);

  // Save data to LocalStorage
  const saveDataToLocalStorage = (newData) => {
    const existingData = JSON.parse(localStorage.getItem('data')) || [];
    const updatedData = [...existingData, newData];

    // If rows exceed 500, remove the oldest data
    if (updatedData.length > 500) {
      updatedData.shift();
    }

    // Save to LocalStorage
    localStorage.setItem('data', JSON.stringify(updatedData));
  };

  useEffect(() => {
    // Sign in anonymously to Firebase when the component mounts
    signInAnonymously(auth)
      .then(() => {
        console.log("User signed in anonymously");
      })
      .catch((error) => {
        console.error("Error signing in anonymously:", error);
      });

    // Reference to the sensor data in Firebase
    const dbRef = ref(database, 'sensor');

    // Set up listener for Firebase data updates
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTDS(data.TDS);  // Update TDS state
        setTurbidity(data.turbidity);  // Update turbidity state

        // Save data to localStorage
        const date = new Date().toLocaleString();
        const newData = {
          turbidity: data.turbidity,
          tds: data.TDS,
          date: date,
        };
        saveDataToLocalStorage(newData);
      }
    });
    
    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  // Toggle table visibility
  const toggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible);
  };

  return (
    <div className='main-container'>
      <div className="dashboard">
        <CircularProgressBar percentage={turbidity} title={"Turbidity"} unit={"NTU"} max_value={1000} />
        <CircularProgressBar percentage={TDS} title={"TDS"} unit={"PPM"} max_value={3000} />
      </div>
      <button className="hide-button" onClick={toggleTableVisibility}>
        {isTableVisible ? "Hide Table ▲" : "Show Table ▼"}
      </button>
      <div className='table-container' style={{ display: isTableVisible ? "block" : "none" }}>
        <Table turbidity_Value={turbidity} TDS_Value={TDS} />
      </div>
    </div>
  );
};


export default FirebaseUpdate;