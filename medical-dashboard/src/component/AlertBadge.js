"use client"

import { useState, useEffect } from "react"
import ENV from "../data/Env"

const AlertBadge = () => {
  const [alertCount, setAlertCount] = useState(0)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  useEffect(() => {
    if (user?.username) {
      fetchAlertCount()
    }
  }, [user])

  const fetchAlertCount = async () => {
    try {
      const response = await fetch(`${ENV.SERVER}/vaccinations/alerts/count/${user.username}`)
      if (response.ok) {
        const data = await response.json()
        setAlertCount(data.count)
      }
    } catch (error) {
      console.error("Error fetching alert count:", error)
    }
  }

  if (alertCount === 0) return null

  return (
    <div
      style={{
        position: "absolute",
        top: "-5px",
        right: "-5px",
        backgroundColor: "red",
        color: "white",
        borderRadius: "50%",
        width: "20px",
        height: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "12px",
        fontWeight: "bold",
      }}
    >
      {alertCount}
    </div>
  )
}

export default AlertBadge
