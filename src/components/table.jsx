import React, { useState, useEffect } from 'react';
import './table.css';
import * as XLSX from 'xlsx';

const Table = ({ turbidity_Value, TDS_Value }) => {
  const [data, setData] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const MAX_ROWS = 500;

  // Load data from localStorage
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('data')) || [];
    setData(savedData);
  }, []);

  // Save data to localStorage
  const saveDataToLocalStorage = (newData) => {
    const updatedData = [...data, newData];

    // If rows exceed MAX_ROWS, remove the oldest entry
    if (updatedData.length > MAX_ROWS) {
      updatedData.shift();
    }

    // Save updated data to localStorage
    localStorage.setItem('data', JSON.stringify(updatedData));
    setData(updatedData); // Update state to trigger re-render
  };

  // Start saving data
  const startSaving = () => {
    setIsSaving(true);
  };

  // Stop saving data
  const stopSaving = () => {
    setIsSaving(false);
  };

  // Delete entire table
  const deleteTable = () => {
    localStorage.removeItem('data');
    setData([]);
  };

  // Export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Turbidity_TDS_Data.xlsx');
  };

  // Periodically save data if isSaving is true
  useEffect(() => {
    if (isSaving) {
      const interval = setInterval(() => {
        const date = new Date().toLocaleString();
        const newData = {
          turbidity: turbidity_Value,
          tds: TDS_Value,
          date: date,
        };
        saveDataToLocalStorage(newData);
      }, 5000); // Save every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isSaving, turbidity_Value, TDS_Value]);

  return (
    <div className="container">
      <h1>Turbidity & TDS Tracker</h1>

      <div className="button-container">
        <button onClick={startSaving} disabled={isSaving}>Start Saving</button>
        <button onClick={stopSaving} disabled={!isSaving}>Stop Saving</button>
        <button onClick={deleteTable}>Delete Table</button>
        <button onClick={exportToExcel}>Export to Excel</button>
      </div>

      <div className="data-table">
        <h2>Recorded Data</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Turbidity</th>
              <th>TDS</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                <td>{entry.turbidity}</td>
                <td>{entry.tds}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
