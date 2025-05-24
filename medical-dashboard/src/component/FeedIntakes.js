// import React, { useState, useEffect } from "react";
// import { db } from '../data/Firebase';
// import { ref, onValue } from "firebase/database";
// import { useNavigate } from 'react-router-dom';
// import axios from "axios";
// import ENV from "../data/Env";
// import FeedDetailsForm from "./FeedDetailsForm";

// const FeedIntakes = () => {
//   const [iotData, setIotData] = useState({
//     BPM: "Loading...",
//     DegreeC: "Loading...",
//     OXY: "Loading...",
//   });

//   const [healthStatus, setHealthStatus] = useState(null);
//   const [confidence, setConfidence] = useState(null);

//   useEffect(() => {
//     const fetchIoTData = () => {
//       const iotHR = ref(db, "BPM");
//       const iotDegreeC = ref(db, "DegreeC");
//       const iotOxy = ref(db, "Spo2");

//       onValue(iotHR, (snapshot) => {
//         setIotData((prev) => ({
//           ...prev,
//           BPM: snapshot.val() !== null ? Number(snapshot.val()) : "N/A",
//         }));
//       });

//       onValue(iotDegreeC, (snapshot) => {
//         setIotData((prev) => ({
//           ...prev,
//           DegreeC: snapshot.val() !== null ? Number(snapshot.val()) : "N/A",
//         }));
//       });

//       onValue(iotOxy, (snapshot) => {
//         setIotData((prev) => ({
//           ...prev,
//           OXY: snapshot.val() !== null ? Number(snapshot.val()) : "N/A",
//         }));
//       });
//     };

//     fetchIoTData();
//     const interval = setInterval(fetchIoTData, 5000); // Refresh every 5 sec

//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     if (
//       iotData.DegreeC !== "Loading..." &&
//       iotData.BPM !== "Loading..." &&
//       iotData.OXY !== "Loading..."
//     ) {
//       axios
//         .get(ENV.SERVER + "/health-status", {
//           params: {
//             body_temp: iotData.DegreeC,
//             heart_rate: iotData.BPM,
//             spo2: iotData.OXY,
//           },
//         })
//         .then((response) => {
//           setHealthStatus(response.data.status ? "Healthy" : "Unhealthy");
//           setConfidence(response.data.confidence);
//         })
//         .catch((error) => console.error("Error fetching health status:", error));
//     }
//   }, [iotData]);

//   return (
//     <div className="recentCustomers">
//       <div className="cardHeader">
//         <h2>Health Condition Checklist</h2>
//       </div>

//       <div
//         style={{
//           border: "1px solid #ddd",
//           borderRadius: "10px",
//           padding: "15px",
//           marginTop: "20px",
//           backgroundColor: "#f9f9f9",
//           boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//           textAlign: "center",
//           maxWidth: "400px",
//           marginLeft: "auto",
//           marginRight: "auto",
//         }}
//       >
//         <h3 style={{ fontSize: "18px", color: "#333", marginBottom: "10px" }}>
//           Most Likely Health:
//         </h3>
//         <p style={{ fontSize: "20px", fontWeight: "bold", color: "#d9534f", margin: "0" }}>
//           {healthStatus || "Checking..."}
//         </p>
//         {confidence !== null && (
//           <p style={{ fontSize: "16px", color: "#555", marginTop: "5px" }}>
//             Confidence: {confidence}%
//           </p>
//         )}
//       </div>

//       {/* Table displaying healthy value ranges */}
//       <div
//         style={{
//           marginTop: "30px",
//           maxWidth: "600px",
//           marginLeft: "auto",
//           marginRight: "auto",
//           backgroundColor: "#f9f9f9",
//           padding: "15px",
//           borderRadius: "10px",
//           boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//         }}
//       >
//         <h3 style={{ fontSize: "18px", color: "#333", marginBottom: "10px" }}>
//           Healthy Value Ranges for Cattle
//         </h3>
//         <table
//           style={{
//             width: "100%",
//             borderCollapse: "collapse",
//             textAlign: "left",
//           }}
//         >
//           <thead>
//             <tr style={{ borderBottom: "2px solid #ddd" }}>
//               <th style={{ padding: "8px", fontWeight: "bold" }}>Parameter</th>
//               <th style={{ padding: "8px", fontWeight: "bold" }}>Healthy Range</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
//                 Body Temperature (°C)
//               </td>
//               <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
//                 38.0°C - 39.5°C
//               </td>
//             </tr>
//             <tr>
//               <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
//                 Body Score
//               </td>
//               <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
//                 3.0 - 4.5 (out of 5)
//               </td>
//             </tr>
//             <tr>
//               <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
//                 Rumen Fill
//               </td>
//               <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
//                 Full (during feeding)
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//       <br></br>
//       <FeedDetailsForm temp={iotData.DegreeC} />
//     </div>
//   );
// };

// export default FeedIntakes;






"use client"

import { useState, useEffect } from "react"
import { db } from "../data/Firebase"
import { ref, onValue } from "firebase/database"
import axios from "axios"
import ENV from "../data/Env"
import FeedDetailsForm from "./FeedDetailsForm"

const FeedIntakes = () => {
  const [iotData, setIotData] = useState({
    BPM: "Loading...",
    DegreeC: "Loading...",
    OXY: "Loading...",
  })

  const [healthStatus, setHealthStatus] = useState(null)
  const [confidence, setConfidence] = useState(null)

  useEffect(() => {
    const fetchIoTData = () => {
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

    fetchIoTData()
    const interval = setInterval(fetchIoTData, 5000) // Refresh every 5 sec

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (
      iotData.DegreeC !== "Loading..." &&
      iotData.BPM !== "Loading..." &&
      iotData.OXY !== "Loading..." &&
      typeof iotData.DegreeC === "number" &&
      typeof iotData.BPM === "number" &&
      typeof iotData.OXY === "number"
    ) {
      axios
        .get(ENV.SERVER + "/health-status", {
          params: {
            body_temp: iotData.DegreeC,
            heart_rate: iotData.BPM,
            spo2: iotData.OXY,
          },
        })
        .then((response) => {
          setHealthStatus(response.data.status ? "Healthy" : "Unhealthy")
          setConfidence(response.data.confidence)
        })
        .catch((error) => console.error("Error fetching health status:", error))
    }
  }, [iotData])

  // Get the temperature value for the FeedDetailsForm
  const getTemperatureValue = () => {
    if (typeof iotData.DegreeC === "number") {
      return iotData.DegreeC
    }
    return 38.5 // Default value if not available
  }

  return (
    <div className="recentCustomers">
      <div className="cardHeader">
        <h2>Health Condition Checklist</h2>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "15px",
          marginTop: "20px",
          backgroundColor: "#f9f9f9",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          maxWidth: "400px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <h3 style={{ fontSize: "18px", color: "#333", marginBottom: "10px" }}>Most Likely Health:</h3>
        <p style={{ fontSize: "20px", fontWeight: "bold", color: "#d9534f", margin: "0" }}>
          {healthStatus || "Checking..."}
        </p>
        {confidence !== null && (
          <p style={{ fontSize: "16px", color: "#555", marginTop: "5px" }}>Confidence: {confidence}%</p>
        )}
      </div>

      {/* Table displaying healthy value ranges */}
      <div
        style={{
          marginTop: "30px",
          maxWidth: "600px",
          marginLeft: "auto",
          marginRight: "auto",
          backgroundColor: "#f9f9f9",
          padding: "15px",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 style={{ fontSize: "18px", color: "#333", marginBottom: "10px" }}>Healthy Value Ranges for Cattle</h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid #ddd" }}>
              <th style={{ padding: "8px", fontWeight: "bold" }}>Parameter</th>
              <th style={{ padding: "8px", fontWeight: "bold" }}>Healthy Range</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>Body Temperature (°C)</td>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>38.0°C - 39.5°C</td>
            </tr>
            <tr>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>Body Score</td>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>3.0 - 4.5 (out of 5)</td>
            </tr>
            <tr>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>Rumen Fill</td>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>Full (during feeding)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <br></br>
      <FeedDetailsForm temp={getTemperatureValue()} />
    </div>
  )
}

export default FeedIntakes
