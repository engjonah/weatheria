const express = require('express');
const connectDB = require('./db/conn');
const { fetchWeatherData } = require('./controllers/weatherController');
const cron = require('node-cron');
const path = require("path");
const cors = require('cors');
const app = require('./app'); // Import the app without connecting to the database

// Connect to MongoDB once when the server starts
connectDB();

// Serve frontend if in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

//
fetchWeatherData();

// Schedule the task to run every hour (only starts at the top of an hour i.e. 12:00)
/*
cron.schedule('0 * * * *', () => {
  console.log('Fetching weather data every hour');
  fetchWeatherData();
});
*/