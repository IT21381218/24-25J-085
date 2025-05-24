"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import ENV from "../data/Env"

const Card = ({ numbers, cardName, icon, link }) => {
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
    // Only fetch alerts if this is the Disease Detection card and we have a user
    if (cardName === "Disease Detection" && user?.username) {
      fetchAlertCount()
    }
  }, [cardName, user])

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

  const displayNumber = cardName === "Disease Detection" ? `${alertCount} Alerts` : numbers

  return (
    <Link to={link || "#"} style={{ textDecoration: "none" }}>
      <div className="card">
        <div>
          <div className="numbers">{displayNumber}</div>
          <div className="cardName">{cardName}</div>
        </div>
        <div className="iconBx">
          <img src={icon || "/placeholder.svg"} alt={cardName} style={{ width: "50px", height: "50px" }} />
        </div>
      </div>
    </Link>
  )
}

export default Card
