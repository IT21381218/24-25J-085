// import React, { useState, useEffect } from 'react';
// import { db } from '../data/Firebase';
// import { ref, onValue } from "firebase/database";
// import { useNavigate } from 'react-router-dom';
// import VaccinationForm from './VaacinationForm';

// const CattleMonitor = ({ cattle }) => {
//     const navigate = useNavigate()
//   const calculateAge = (birthDate) => {
//     const birth = new Date(birthDate);
//     const today = new Date();
//     const ageInMilliseconds = today - birth;
//     const ageInYears = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 365));
//     const ageInMonths = Math.floor((ageInMilliseconds % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
//     return `${ageInYears} years, ${ageInMonths} months`;
//   };
//   const [showAlert, setShowAlert] = useState(false)

//   const [cowData, setCowData] = useState({
//     name: '',
//     id: '',
//     age: '',
//     breed: '',
//     health: '',
//     owner: '',
//     status: '',
//     image: '',
//   });

//   const [iotData, setIotData] = useState({
//     BPM: 'Loading...',
//     DegreeC: 'Loading...',
//     OXY: 'Loading...',
//   });

//   useEffect(() => {
//     if (cattle) {
//       setCowData({
//         name: cattle.name || '',
//         id: cattle.id || '',
//         age: calculateAge(cattle.birth),
//         breed: cattle.breed || '',
//         health: cattle.health || '',
//         owner: cattle.owner || '',
//         status: cattle.status || '',
//         image: cattle.image || '',
//       });
//     }
//   }, [cattle]);

//   useEffect(() => {
//     const fetchData = () => {
//       const iotHR = ref(db, 'BPM'); 
//       const iotDegreeC = ref(db, 'DegreeC'); 
//       const iotOxy = ref(db, 'Spo2'); 

//       onValue(iotHR, (snapshot) => {
//         setIotData((prev) => ({
//           ...prev,
//           BPM: snapshot.val() !== null ? Number(snapshot.val()) : 'N/A',
//         }));
//       });

//       onValue(iotDegreeC, (snapshot) => {
//         setIotData((prev) => ({
//           ...prev,
//           DegreeC: snapshot.val() !== null ? Number(snapshot.val()) : 'N/A',
//         }));
//       });

//       onValue(iotOxy, (snapshot) => {
//         setIotData((prev) => ({
//           ...prev,
//           OXY: snapshot.val() !== null ? Number(snapshot.val()) : 'N/A',
//         }));
//       });

//       // Check if any value is out of the valid range
//       if (
//         isOutOfRange(iotData.DegreeC, 38.5, 39.5) ||
//         isOutOfRange(iotData.BPM, 48, 84) ||
//         isOutOfRange(iotData.OXY, 95, 100)
//       ) {
//         console.log("++++++++");
//         console.log("TEMP"+isOutOfRange(iotData.DegreeC, 38.5, 39.5));
//         console.log("OXY"+isOutOfRange(iotData.OXY, 48, 84));
//         console.log("BPM"+isOutOfRange(iotData.BPM, 95, 100));
//         setShowAlert(true); // Show alert if any value is out of range
//       } else {
//         setShowAlert(false); // Hide alert if all values are within range
//       }
//     };

//     // Fetch data initially and then every 5 seconds
//     fetchData();
//     const interval = setInterval(fetchData, 5000);

//     return () => clearInterval(interval); // Cleanup on unmount
//   }, [iotData]);

//   const isOutOfRange = (value, min, max) => value < min || value > max;

  

  

//   const getActionInstructions = () => {
//     console.log(isOutOfRange(iotData.DegreeC, 38.5, 39.5))
//     if (isOutOfRange.DegreeC && isOutOfRange.BPM) {
//       return "The cow is experiencing abnormal body temperature and low oxygen levels. Ensure a proper ventilation system, provide cool water, and consult a veterinarian immediately.";
//     } else if (isOutOfRange.DegreeC) {
//       return "The cow's body temperature is outside the normal range. Provide a cool and shaded environment, ensure hydration, and monitor closely.";
//     } else if (isOutOfRange.BPM) {
//       return "The cow's oxygen saturation is below normal. Check for respiratory issues, improve ventilation, and seek veterinary attention.";
//     }
//     return "Health parameters are within the normal range.";
//   };

//   const handleChange = (e) => {
//     setCowData({ ...cowData, [e.target.name]: e.target.value });
//   };

//   const inputStyle = {
//     border: '1px solid #ccc',
//     padding: '10px',
//     width: '100%',
//     borderRadius: '5px',
//     marginBottom: '10px',
//   };

//   const buttonStyle = {
//     backgroundColor: '#e74c3c',
//     color: 'white',
//     padding: '10px',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     marginTop: '10px',
//   };

//   const tableStyle = {
//     width: '100%',
//     borderCollapse: 'collapse',
//     marginTop: '10px',
//   };

//   const thTdStyle = {
//     border: '1px solid #ddd',
//     padding: '10px',
//     textAlign: 'left',
//   };

//   return (
//     <div className='recentOrders'>
//       <div style={{ display: 'flex', gap: '20px' }}>
//         {/* Left Section: Cattle Profile */}
//         <div style={{ flex: 1, textAlign: 'center' }}>
//           <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', margin: 'auto', marginBottom: '10px' }}>
//             <img src={cowData.image} alt={cowData.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//           </div>
//           <input name="name" placeholder="Cow Name" style={inputStyle} onChange={handleChange} value={cowData.name} />
//           <input name="id" placeholder="Cow ID" style={inputStyle} onChange={handleChange} value={cowData.id} />
//           <input name="age" placeholder="Cow Age" style={inputStyle} onChange={handleChange} value={cowData.age} />
//           <input name="breed" placeholder="Cow Breed" style={inputStyle} onChange={handleChange} value={cowData.breed} />
//         </div>

//         {/* Right Section: Health Status */}
//         <div style={{ flex: 2 }}>
//           <h2>Health Status</h2>
//           <table style={tableStyle}>
//             <thead>
//               <tr>
//                 <th style={thTdStyle}>Measures</th>
//                 <th style={thTdStyle}>Normal Range</th>
//                 <th style={thTdStyle}>Your Cow Level</th>
//               </tr>
//             </thead>
//             <tbody>
//                 <tr style={isOutOfRange(iotData.DegreeC, 38.5, 39.5) ? { backgroundColor: 'red', color: 'white' } : {}}>
//                     <td style={thTdStyle}>Body Temperature</td>
//                     <td style={thTdStyle}>38.5 - 39.5°C</td>
//                     <td style={thTdStyle}>{iotData.DegreeC}°C</td>
//                 </tr>
//                 <tr style={isOutOfRange(iotData.BPM, 48, 84) ? { backgroundColor: 'red', color: 'white' } : {}}>
//                     <td style={thTdStyle}>Heart Rate (Pulse Rate)</td>
//                     <td style={thTdStyle}>48 - 84 bpm</td>
//                     <td style={thTdStyle}>{iotData.BPM} bpm</td>
//                 </tr>
//                 <tr style={isOutOfRange(iotData.OXY, 95, 100) ? { backgroundColor: 'red', color: 'white' } : {}}>
//                     <td style={thTdStyle}>Oxygen Saturation</td>
//                     <td style={thTdStyle}>95 - 100%</td>
//                     <td style={thTdStyle}>{iotData.OXY}%</td>
//                 </tr>
//             </tbody>
//           </table>
//           {/* <p style={{ color: 'red', fontWeight: 'bold' }}>{getActionInstructions()}</p> */}

//           {showAlert && (
//             <div 
//               style={{
//                 backgroundColor: '#ffcccb',
//                 padding: '15px',
//                 borderRadius: '10px',
//                 color: '#c0392b',
//                 marginTop: '10px',
//                 boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
//                 textAlign: 'left'
//               }}
//             >
//               <h3 style={{ margin: '0 0 10px 0', textAlign: 'center' }}>⚠️ Unhealthy Cattle Alert</h3>
//               <ul style={{ paddingLeft: '20px' }}>
//                 <li>✔️ Check body temperature and hydration levels.</li>
//                 <li>✔️ Ensure proper feeding and mineral supplements.</li>
//                 <li>✔️ Isolate sick cattle from the healthy ones.</li>
//                 <li>✔️ Contact a veterinarian for further examination.</li>
//                 <li>✔️ Keep track of symptoms for better diagnosis.</li>
//               </ul>

//               <button 
//                 onClick={() => navigate('/logged/map')}
//                 style={{ 
//                   backgroundColor: '#e74c3c', 
//                   color: 'white', 
//                   padding: '10px 15px', 
//                   border: 'none', 
//                   borderRadius: '5px', 
//                   cursor: 'pointer', 
//                   marginTop: '10px', 
//                   width: '100%',
//                   display: 'block',
//                   textAlign: 'center'
//                 }}
//               >
//                 Get Treatments
//               </button>
//             </div>
//           )}

//           {showAlert && <button 
//           onClick={() => {navigate('/logged/map')}}
//           style={{ backgroundColor: '#e74c3c', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>Get Treatments</button>}
//         </div>
//       </div>

//       {/* Reminder and Alert Set */}
//       {/* <div style={{ marginTop: '20px' }}>
//         <h3>Reminder and Alert Set</h3>
//         <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', marginTop: '10px' }}>
//           <input placeholder="Vet Checkup" style={inputStyle} />
//           <button style={buttonStyle}>Set</button>
//           <input placeholder="Vaccination" style={inputStyle} />
//           <button style={buttonStyle}>Set</button>
//           <input placeholder="Medical Treatment" style={inputStyle} />
//           <button style={buttonStyle}>Set</button>
//         </div>
//       </div> */}

//       {/* Action and Recommendation */}
//       <div style={{ marginTop: '20px' }}>
//         <h3>Action and Recommendation</h3>
//         <p><strong>Health Status:</strong> {cowData.health}</p>
//         <p><strong>Status:</strong> {cowData.status}</p>
//         <p><strong>Owner:</strong> {cowData.owner}</p>
//         <p><strong>Nutrition and Food:</strong> Provide a balanced diet rich in minerals and vitamins.</p>
//         <button style={buttonStyle}>Contact Vet</button>
//       </div>
//       <br></br><br></br>
//       <VaccinationForm />
//     </div>
//   );
// };

// export default CattleMonitor;








"use client"

import { useState, useEffect } from "react"
import { db } from "../data/Firebase"
import { ref, onValue } from "firebase/database"
import { useNavigate } from "react-router-dom"
import VaccinationForm from "./VaacinationForm"

const CattleMonitor = ({ cattle }) => {
  const navigate = useNavigate()
  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate)
    const today = new Date()
    const ageInMilliseconds = today - birth
    const ageInYears = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 365))
    const ageInMonths = Math.floor((ageInMilliseconds % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))
    return `${ageInYears} years, ${ageInMonths} months`
  }
  const [showAlert, setShowAlert] = useState(false)

  const [cowData, setCowData] = useState({
    name: "",
    id: "",
    age: "",
    breed: "",
    health: "",
    owner: "",
    status: "",
    image: "",
  })

  const [iotData, setIotData] = useState({
    BPM: "Loading...",
    DegreeC: "Loading...",
    OXY: "Loading...",
  })

  useEffect(() => {
    if (cattle) {
      setCowData({
        name: cattle.name || "",
        id: cattle.id || "",
        age: calculateAge(cattle.birth),
        breed: cattle.breed || "",
        health: cattle.health || "",
        owner: cattle.owner || "",
        status: cattle.status || "",
        image: cattle.image || "",
      })
    }
  }, [cattle])

  // Function to check if a value is out of range
  const isOutOfRange = (value, min, max) => {
    // Handle non-numeric values
    if (typeof value !== "number") return false
    return value < min || value > max
  }

  // Effect to fetch IoT data
  useEffect(() => {
    const fetchData = () => {
      const iotHR = ref(db, "BPM")
      const iotDegreeC = ref(db, "DegreeC")
      const iotOxy = ref(db, "Spo2")

      onValue(iotHR, (snapshot) => {
        setIotData((prev) => ({
          ...prev,
          BPM: snapshot.val() !== null ? Number(snapshot.val()) : "N/A",
        }))
      })

      onValue(iotDegreeC, (snapshot) => {
        setIotData((prev) => ({
          ...prev,
          DegreeC: snapshot.val() !== null ? Number(snapshot.val()) : "N/A",
        }))
      })

      onValue(iotOxy, (snapshot) => {
        setIotData((prev) => ({
          ...prev,
          OXY: snapshot.val() !== null ? Number(snapshot.val()) : "N/A",
        }))
      })
    }

    // Fetch data initially and then every 5 seconds
    fetchData()
    const interval = setInterval(fetchData, 5000)

    return () => clearInterval(interval) // Cleanup on unmount
  }, []) // Empty dependency array - only run on mount

  // Separate effect to check values and set alert
  useEffect(() => {
    // Check if any value is out of the valid range
    if (
      isOutOfRange(iotData.DegreeC, 38.5, 39.5) ||
      isOutOfRange(iotData.BPM, 48, 84) ||
      isOutOfRange(iotData.OXY, 95, 100)
    ) {
      setShowAlert(true) // Show alert if any value is out of range
    } else {
      setShowAlert(false) // Hide alert if all values are within range
    }
  }, [iotData.DegreeC, iotData.BPM, iotData.OXY]) // Only run when these values change

  const getActionInstructions = () => {
    if (isOutOfRange(iotData.DegreeC, 38.5, 39.5) && isOutOfRange(iotData.BPM, 48, 84)) {
      return "The cow is experiencing abnormal body temperature and low oxygen levels. Ensure a proper ventilation system, provide cool water, and consult a veterinarian immediately."
    } else if (isOutOfRange(iotData.DegreeC, 38.5, 39.5)) {
      return "The cow's body temperature is outside the normal range. Provide a cool and shaded environment, ensure hydration, and monitor closely."
    } else if (isOutOfRange(iotData.BPM, 48, 84)) {
      return "The cow's oxygen saturation is below normal. Check for respiratory issues, improve ventilation, and seek veterinary attention."
    }
    return "Health parameters are within the normal range."
  }

  const handleChange = (e) => {
    setCowData({ ...cowData, [e.target.name]: e.target.value })
  }

  const inputStyle = {
    border: "1px solid #ccc",
    padding: "10px",
    width: "100%",
    borderRadius: "5px",
    marginBottom: "10px",
  }

  const buttonStyle = {
    backgroundColor: "#e74c3c",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  }

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  }

  const thTdStyle = {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",
  }

  return (
    <div className="recentOrders">
      <div style={{ display: "flex", gap: "20px" }}>
        {/* Left Section: Cattle Profile */}
        <div style={{ flex: 1, textAlign: "center" }}>
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              overflow: "hidden",
              margin: "auto",
              marginBottom: "10px",
            }}
          >
            <img
              src={cowData.image || "/placeholder.svg"}
              alt={cowData.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <input name="name" placeholder="Cow Name" style={inputStyle} onChange={handleChange} value={cowData.name} />
          <input name="id" placeholder="Cow ID" style={inputStyle} onChange={handleChange} value={cowData.id} />
          <input name="age" placeholder="Cow Age" style={inputStyle} onChange={handleChange} value={cowData.age} />
          <input
            name="breed"
            placeholder="Cow Breed"
            style={inputStyle}
            onChange={handleChange}
            value={cowData.breed}
          />
        </div>

        {/* Right Section: Health Status */}
        <div style={{ flex: 2 }}>
          <h2>Health Status</h2>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thTdStyle}>Measures</th>
                <th style={thTdStyle}>Normal Range</th>
                <th style={thTdStyle}>Your Cow Level</th>
              </tr>
            </thead>
            <tbody>
              <tr style={isOutOfRange(iotData.DegreeC, 38.5, 39.5) ? { backgroundColor: "red", color: "white" } : {}}>
                <td style={thTdStyle}>Body Temperature</td>
                <td style={thTdStyle}>38.5 - 39.5°C</td>
                <td style={thTdStyle}>{iotData.DegreeC}°C</td>
              </tr>
              <tr style={isOutOfRange(iotData.BPM, 48, 84) ? { backgroundColor: "red", color: "white" } : {}}>
                <td style={thTdStyle}>Heart Rate (Pulse Rate)</td>
                <td style={thTdStyle}>48 - 84 bpm</td>
                <td style={thTdStyle}>{iotData.BPM} bpm</td>
              </tr>
              <tr style={isOutOfRange(iotData.OXY, 95, 100) ? { backgroundColor: "red", color: "white" } : {}}>
                <td style={thTdStyle}>Oxygen Saturation</td>
                <td style={thTdStyle}>95 - 100%</td>
                <td style={thTdStyle}>{iotData.OXY}%</td>
              </tr>
            </tbody>
          </table>
          {/* <p style={{ color: 'red', fontWeight: 'bold' }}>{getActionInstructions()}</p> */}

          {showAlert && (
            <div
              style={{
                backgroundColor: "#ffcccb",
                padding: "15px",
                borderRadius: "10px",
                color: "#c0392b",
                marginTop: "10px",
                boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
                textAlign: "left",
              }}
            >
              <h3 style={{ margin: "0 0 10px 0", textAlign: "center" }}>⚠️ Unhealthy Cattle Alert</h3>
              <ul style={{ paddingLeft: "20px" }}>
                <li>✔️ Check body temperature and hydration levels.</li>
                <li>✔️ Ensure proper feeding and mineral supplements.</li>
                <li>✔️ Isolate sick cattle from the healthy ones.</li>
                <li>✔️ Contact a veterinarian for further examination.</li>
                <li>✔️ Keep track of symptoms for better diagnosis.</li>
              </ul>

              <button
                onClick={() => navigate("/logged/map")}
                style={{
                  backgroundColor: "#e74c3c",
                  color: "white",
                  padding: "10px 15px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginTop: "10px",
                  width: "100%",
                  display: "block",
                  textAlign: "center",
                }}
              >
                Get Treatments
              </button>
            </div>
          )}

          {showAlert && (
            <button
              onClick={() => {
                navigate("/logged/map")
              }}
              style={{
                backgroundColor: "#e74c3c",
                color: "white",
                padding: "10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Get Treatments
            </button>
          )}
        </div>
      </div>

      {/* Action and Recommendation */}
      <div style={{ marginTop: "20px" }}>
        <h3>Action and Recommendation</h3>
        <p>
          <strong>Health Status:</strong> {cowData.health}
        </p>
        <p>
          <strong>Status:</strong> {cowData.status}
        </p>
        <p>
          <strong>Owner:</strong> {cowData.owner}
        </p>
        <p>
          <strong>Nutrition and Food:</strong> Provide a balanced diet rich in minerals and vitamins.
        </p>
        <button style={buttonStyle}>Contact Vet</button>
      </div>
      <br></br>
      <br></br>
      <VaccinationForm />
    </div>
  )
}

export default CattleMonitor

