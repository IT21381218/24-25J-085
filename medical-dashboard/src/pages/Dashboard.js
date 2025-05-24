"use client"

// pages/Dashboard.js
import { useState, useEffect } from "react"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import RecentCustomers from "../components/RecentCustomers"
import Footer from "../components/Footer"
import Card from "../components/Card"
import RecentAppointments from "../components/RecentAppointments"
import ENV from "../data/Env"

const Dashboard = () => {
  const [cattleCount, setCattleCount] = useState(0)
  const [milkProduction, setMilkProduction] = useState(0)
  const [feedingCount, setFeedingCount] = useState(0)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      fetchDashboardData(JSON.parse(storedUser).username)
    }
  }, [])

  const fetchDashboardData = async (username) => {
    try {
      // Fetch cattle count
      const cattleResponse = await fetch(`${ENV.SERVER}/cattle/owner/${username}`)
      if (cattleResponse.ok) {
        const cattleData = await cattleResponse.json()
        setCattleCount(cattleData.length)
      }

      // Fetch milk production data
      const today = new Date()
      const dateStr = today.toISOString().split("T")[0] // Format: YYYY-MM-DD
      const milkResponse = await fetch(`${ENV.SERVER}/milk-summary/${username}/${dateStr}`)
      if (milkResponse.ok) {
        const milkData = await milkResponse.json()
        if (milkData.summary) {
          setMilkProduction(milkData.summary.actual_total || 0)
        }
      }

      // You could add more fetches here for feeding data if available
      setFeedingCount(Math.floor(Math.random() * 5)) // Placeholder
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    }
  }

  return (
    <div className="dashContainer">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="cardBox">
          <Card
            numbers={`${cattleCount}`}
            cardName="Cattle Management"
            icon="/icons/farm-icon-removebg-preview.png"
            link="/logged/cattle"
          />
          <Card
            numbers="0 Alerts"
            cardName="Disease Detection"
            icon="/icons/cow-icon-removebg-preview.png"
            link="/logged/disease-detection"
          />
          <Card
            numbers={`${milkProduction} Daily`}
            cardName="Production Management"
            icon="/icons/milk-icon-removebg-preview.png"
            link="/logged/milk-production"
          />
          <Card
            numbers={`${feedingCount} Daily`}
            cardName="Feeding"
            icon="/icons/feed-icon-removebg-preview.png"
            link="/logged/health-monitor"
          />
        </div>
        <div className="details">
          <RecentAppointments />
          <RecentCustomers />
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default Dashboard
