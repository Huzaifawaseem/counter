import React, { useState, useEffect } from 'react';
import './table.css';
import * as XLSX from 'xlsx';

const Table = ({
  temperature,
  pH,
  EC,
  ORP,
  TDS,
  turbidity,
}) => {
  const [data, setData] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const MAX_ROWS = 500;

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('data')) || [];
    setData(savedData);
  }, []);

  // Function to save new data to localStorage and update state
  const saveDataToLocalStorage = (newData) => {
    const updatedData = [...data, newData];
    // Keep the rows within MAX_ROWS
    if (updatedData.length > MAX_ROWS) {
      updatedData.shift(); // remove the oldest entry
    }
    localStorage.setItem('data', JSON.stringify(updatedData));
    setData(updatedData);
  };

  // Start and stop saving functions
  const startSaving = () => {
    setIsSaving(true);
  };

  const stopSaving = () => {
    setIsSaving(false);
  };

  // Delete the entire table (clear localStorage data)
  const deleteTable = () => {
    localStorage.removeItem('data');
    setData([]);
  };

  // Export data to an Excel file
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'Sensor_Data.xlsx');
  };

  // Periodically save sensor readings if "isSaving" is true
  useEffect(() => {
    if (isSaving) {
      const interval = setInterval(() => {
        const date = new Date().toLocaleString();
        const newData = {
          temperature,
          pH,
          EC,
          ORP,
          tds: TDS,
          turbidity,
          date,
        };
        saveDataToLocalStorage(newData);
      }, 5000); // every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isSaving, temperature, pH, EC, ORP, TDS, turbidity]);

  return (
    <div className="container">
      <h1>Sensor Data Tracker</h1>
      <div className="button-container">
        <button onClick={startSaving} disabled={isSaving}>
          Start Saving
        </button>
        <button onClick={stopSaving} disabled={!isSaving}>
          Stop Saving
        </button>
        <button onClick={deleteTable}>Delete Table</button>
        <button onClick={exportToExcel}>Export to Excel</button>
      </div>
      <div className="data-table">
        <h2>Recorded Data</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Temperature (°C)</th>
              <th>pH</th>
              <th>EC (µs/cm)</th>
              <th>ORP (mV)</th>
              <th>TDS (PPM)</th>
              <th>Turbidity (NTU)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                <td>{entry.temperature}</td>
                <td>{entry.pH}</td>
                <td>{entry.EC}</td>
                <td>{entry.ORP}</td>
                <td>{entry.tds}</td>
                <td>{entry.turbidity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
