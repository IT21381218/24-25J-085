// // pages/MilkProduction.js
// import React, { useEffect, useState } from 'react';
// import Sidebar from '../components/Sidebar';
// import Topbar from '../components/Topbar';
// import Footer from '../components/Footer';
// import UserSummary from '../components/UserSummary';
// import CattleForm from '../components/CattleForm';
// import ENV from '../data/Env';
// import VeterinarianSummary from '../components/VetSummary';

// const CowProfile = () => {
//   const [user, setUser] = useState(() => {
//     const storedUser = localStorage.getItem('user');
//     return storedUser ? JSON.parse(storedUser) : {};
//   });

//   const [cattles, setCattles] = useState([]); 
//   const [appointments, setAppointments] = useState([]);

//   const addNewCattle = (newCattle) => {
//     setCattles((prevCattles) => [...prevCattles, newCattle]);
//   };

//   const removeCattle = (id) => {
//     setCattles((prevCattles) => prevCattles.filter((cattle) => cattle.id !== id));
//   }

//   const removeAppointment = (id) => {
//     setAppointments((prevapo) => prevapo.filter((apo) => apo.id !== id));
//   }

//   // Fetch cattles on component mount
//   useEffect(() => {
//     if (user.role === "Veterinarian") {
//       const fetchAppointments = async () => {
//         try {
//           const response = await fetch(`${ENV.SERVER}/appointments/title/${encodeURIComponent(user.full_name)}`);
//           if (!response.ok) {
//             throw new Error("No appointments found.");
//           }
//           const data = await response.json();
//           setAppointments(data);
//           console.log("Appointments:", data);
//         } catch (error) {
//           console.error("Error fetching appointments:", error);
//         }
//       };

//       fetchAppointments();
//     } else {
//       const fetchCattles = async () => {
//         try {
//           const response = await fetch(`${ENV.SERVER}/cattle/owner/${user.username}`);
//           const data = await response.json();
//           setCattles(data);
//           console.log("Cattles:", data);
//         } catch (error) {
//           console.error("Error fetching cattles:", error);
//         }
//       };

//       if (user.username) {
//         fetchCattles();
//       }
//     }
//   }, [user.username, user.role, user.full_name]);


//   return (
//     <div className="dashContainer">
//       <Sidebar />
//       <div className="main">
//         <Topbar />
//         <div className="details">
//           {
//             user.role!='Veterinarian'?<UserSummary user={user} cattles={cattles} removeCattle={removeCattle}/>:<VeterinarianSummary veterinarian={user} appointments={appointments} removeAppointment={removeAppointment}/>
//           }
          
//           {
//             user.role!='Veterinarian'?<CattleForm user={user} addNewCattle={addNewCattle}/>:<></>
//           }
//         </div>
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default CowProfile;











"use client"

// pages/MilkProduction.js
import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import Footer from "../components/Footer"
import UserSummary from "../components/UserSummary"
import CattleForm from "../components/CattleForm"
import ENV from "../data/Env"
import VeterinarianSummary from "../components/VetSummary"
import VetQualifications from "../components/VetQualifications"

const CowProfile = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user")
    return storedUser ? JSON.parse(storedUser) : {}
  })

  const [cattles, setCattles] = useState([])
  const [appointments, setAppointments] = useState([])

  const addNewCattle = (newCattle) => {
    setCattles((prevCattles) => [...prevCattles, newCattle])
  }

  const removeCattle = (id) => {
    setCattles((prevCattles) => prevCattles.filter((cattle) => cattle.id !== id))
  }

  const removeAppointment = (id) => {
    setAppointments((prevapo) => prevapo.filter((apo) => apo.id !== id))
  }

  // Fetch cattles on component mount
  useEffect(() => {
    if (user.role === "Veterinarian") {
      const fetchAppointments = async () => {
        try {
          const response = await fetch(`${ENV.SERVER}/appointments/title/${encodeURIComponent(user.full_name)}`)
          if (!response.ok) {
            throw new Error("No appointments found.")
          }
          const data = await response.json()
          setAppointments(data)
          console.log("Appointments:", data)
        } catch (error) {
          console.error("Error fetching appointments:", error)
        }
      }

      fetchAppointments()
    } else {
      const fetchCattles = async () => {
        try {
          const response = await fetch(`${ENV.SERVER}/cattle/owner/${user.username}`)
          const data = await response.json()
          setCattles(data)
          console.log("Cattles:", data)
        } catch (error) {
          console.error("Error fetching cattles:", error)
        }
      }

      if (user.username) {
        fetchCattles()
      }
    }
  }, [user.username, user.role, user.full_name])

  return (
    <div className="dashContainer">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="details">
          {user.role !== "Veterinarian" ? (
            <UserSummary user={user} cattles={cattles} removeCattle={removeCattle} />
          ) : (
            <VeterinarianSummary
              veterinarian={user}
              appointments={appointments}
              removeAppointment={removeAppointment}
            />
          )}

          {user.role !== "Veterinarian" ? (
            <CattleForm user={user} addNewCattle={addNewCattle} />
          ) : (
            <VetQualifications veterinarian={user} />
          )}
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default CowProfile
