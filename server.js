const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows frontend to communicate with backend
app.use(express.json());

// --- CONFIGURATION ---
// NOTE: Production mein API Key .env file mein rakho (process.env.GEMINI_API_KEY)
// Testing ke liye hum fallback key use kar rahe hain
const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBeT3OI3mmOfAFdQFGiVpHT4CPvRP_ek10"; 

const genAI = new GoogleGenerativeAI(API_KEY);

// --- ROUTES ---

// 1. Health Check
app.get('/', (req, res) => {
    res.send('Prism AI Backend is Running!');
});

// 2. Chat Endpoint (Handles Gemini requests)
app.post('/api/chat', async (req, res) => {
    try {
        const { message, modelId } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Gemini model select karo
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.json({ 
            success: true, 
            data: text,
            model: "gemini-1.5-flash"
        });

    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ 
            success: false, 
            error: "Failed to fetch response from AI",
            details: error.message 
        });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});