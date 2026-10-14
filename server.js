require("dotenv").config()

const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const { Low } = require("lowdb")
const { JSONFile } = require("lowdb/node")

const app = express()

app.use(cors())
app.use(bodyParser.json())

// Database configuration
const adapter = new JSONFile("db.json")
const db = new Low(adapter, {})

// Initialize database
async function initDB() {
  await db.read()

  db.data ||= {
    users: [],
    subscriptions: []
  }

  await db.write()
}

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "SubTracker API running 🚀"
  })
})

// Test DB route
app.get("/test-db", async (req, res) => {

  await db.read()

  res.json({
    users: db.data.users,
    subscriptions: db.data.subscriptions
  })

})

const PORT = process.env.PORT || 5000

// Start server after DB init
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
})