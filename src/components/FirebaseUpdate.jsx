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
  // State variables for all sensor parameters
  const [temperature, setTemperature] = useState(null);
  const [pH, setPH] = useState(null);
  const [EC, setEC] = useState(null);
  const [ORP, setORP] = useState(null);
  const [TDS, setTDS] = useState(null);
  const [turbidity, setTurbidity] = useState(null);
  const [isTableVisible, setIsTableVisible] = useState(true);

  // On mount: load the latest saved reading from localStorage
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('data')) || [];
    if (savedData.length > 0) {
      const latest = savedData[savedData.length - 1];
      setTemperature(latest.temperature);
      setPH(latest.pH);
      setEC(latest.EC);
      setORP(latest.ORP);
      setTDS(latest.tds);
      setTurbidity(latest.turbidity);
    }
  }, []);

  // Save new sensor reading to localStorage
  const saveDataToLocalStorage = (newData) => {
    const existingData = JSON.parse(localStorage.getItem('data')) || [];
    const updatedData = [...existingData, newData];
    if (updatedData.length > 500) {
      updatedData.shift();
    }
    localStorage.setItem('data', JSON.stringify(updatedData));
  };

  useEffect(() => {
    // Sign in anonymously to Firebase when the component mounts
    signInAnonymously(auth)
      .then(() => console.log("User signed in anonymously"))
      .catch((error) => console.error("Error signing in anonymously:", error));

    // Reference to the sensor data in Firebase
    const dbRef = ref(database, 'sensor');

    // Set up listener for Firebase data updates
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Update state for all parameters
        setTemperature(data.temperature);
        setPH(data.pH);
        setEC(data.EC);
        setORP(data.ORP);
        setTDS(data.TDS);
        setTurbidity(data.turbidity);

        // Save new data with timestamp
        const date = new Date().toLocaleString();
        const newData = {
          temperature: data.temperature,
          pH: data.pH,
          EC: data.EC,
          ORP: data.ORP,
          tds: data.TDS,
          turbidity: data.turbidity,
          date,
        };
        saveDataToLocalStorage(newData);
      }
    });
    
    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const toggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible);
  };

  return (
    <div className="main-container">
      <div className="dashboard">
        <CircularProgressBar percentage={temperature} title="Temperature" unit="°C" max_value={125} />
        <CircularProgressBar percentage={pH} title="pH" unit="pH" max_value={14} />
        <CircularProgressBar percentage={EC} title="EC" unit="µs/cm" max_value={15000} />
        <CircularProgressBar percentage={ORP} title="ORP" unit="mV" max_value={650} />
        <CircularProgressBar percentage={TDS} title="TDS" unit="PPM" max_value={3000} />
        <CircularProgressBar percentage={turbidity} title="Turbidity" unit="NTU" max_value={1000} />
      </div>
      <button className="hide-button" onClick={toggleTableVisibility}>
        {isTableVisible ? "Hide Table ▲" : "Show Table ▼"}
      </button>
      <div className="table-container" style={{ display: isTableVisible ? "block" : "none" }}>
        {/* Pass the sensor values using the same names */}
        <Table 
          temperature={temperature}
          pH={pH}
          EC={EC}
          ORP={ORP}
          TDS={TDS}
          turbidity={turbidity} 
        />
      </div>
    </div>
  );
};

export default FirebaseUpdate;
