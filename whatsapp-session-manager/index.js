const express = require("express");
const { nanoid } = require("nanoid"); // For unique session IDs
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// File to store session data
const SESSIONS_FILE = "sessions.json";

// Utility: Load sessions from file
function loadSessions() {
  if (!fs.existsSync(SESSIONS_FILE)) {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify({}));
  }
  return JSON.parse(fs.readFileSync(SESSIONS_FILE));
}

// Utility: Save sessions to file
function saveSessions(sessions) {
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions));
}

// Endpoint: Generate a new session ID
app.post("/generate-session", (req, res) => {
  const sessionId = nanoid(16); // Generate a unique 16-character ID
  const sessions = loadSessions();

  if (sessions[sessionId]) {
    return res.status(400).json({ success: false, message: "Session already exists!" });
  }

  // Initialize session with default data
  sessions[sessionId] = { created: new Date().toISOString(), data: {} };
  saveSessions(sessions);

  res.json({
    success: true,
    sessionId: sessionId,
    message: "Session ID generated successfully.",
  });
});

// Endpoint: Retrieve session data
app.get("/session/:id", (req, res) => {
  const sessions = loadSessions();
  const sessionId = req.params.id;

  if (!sessions[sessionId]) {
    return res.status(404).json({ success: false, message: "Session not found!" });
  }

  res.json({
    success: true,
    sessionId: sessionId,
    data: sessions[sessionId],
  });
});

// Endpoint: Update session data
app.post("/session/:id", (req, res) => {
  const sessions = loadSessions();
  const sessionId = req.params.id;
  const newData = req.body.data;

  if (!sessions[sessionId]) {
    return res.status(404).json({ success: false, message: "Session not found!" });
  }

  // Update session with new data
  sessions[sessionId].data = { ...sessions[sessionId].data, ...newData };
  saveSessions(sessions);

  res.json({
    success: true,
    message: "Session data updated successfully.",
    data: sessions[sessionId],
  });
});

// Endpoint: Delete a session
app.delete("/session/:id", (req, res) => {
  const sessions = loadSessions();
  const sessionId = req.params.id;

  if (!sessions[sessionId]) {
    return res.status(404).json({ success: false, message: "Session not found!" });
  }

  delete sessions[sessionId];
  saveSessions(sessions);

  res.json({ success: true, message: "Session deleted successfully." });
});

// Health check endpoint
app.get("/", (req, res) => {
  res.send("WhatsApp Session Manager is running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

