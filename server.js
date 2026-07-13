const express = require('express');
const axios = require('axios');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// 1. SOFTWARE COMPLETENESS: Configure CORS
// In production, change origin from '*' to your actual Render frontend URL
app.use(cors({
    origin: '*', 
    methods: ['GET'],
    allowedHeaders: ['Content-Type']
}));

// 2. SOFTWARE COMPLETENESS: Anti-Spam Rate Limiting
// Limits each IP to 30 requests per 15 minutes to protect your Google API budget
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, 
    message: { success: false, error: "Too many requests from this IP, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

const PORT = process.env.PORT || 3000;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// 3. ROBUST ERROR HANDLING: Pre-flight Configuration Check
if (!GOOGLE_API_KEY) {
    console.error("❌ CRITICAL CONFIGURATION ERROR: GOOGLE_API_KEY is missing from your environment variables.");
    process.exit(1); // Stop the server immediately if misconfigured
}

/**
 * @route   GET /api/pizza
 * @desc    Proxy endpoint to securely fetch pizza places from Google Places API via JSON
 * @access  Public (Rate-limited)
 */
app.get('/api/pizza', async (req, res) => {
    const { lat, lng } = req.query;

    // 4. ROBUST ERROR HANDLING: Incoming Parameter Validation
    if (!lat || !lng) {
        return res.status(400).json({ 
            success: false, 
            error: "Missing required parameters. Both 'lat' and 'lng' must be provided in the query string." 
        });
    }

    // MoSCoW: Core API Request configuration (Nearby Search for Pizza within a 2000m radius)
    const googleUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=2000&type=restaurant&keyword=pizza&key=${GOOGLE_API_KEY}`;
    
    try {
        // 5. ROBUST ERROR HANDLING: Network Request Timeout protection (5 seconds)
        const response = await axios.get(googleUrl, { timeout: 5000 });
        
        const data = response.data;

        // 6. ROBUST ERROR HANDLING: Catch Hidden Google API Payload Errors
        // Google occasionally returns an HTTP status 200 OK but inserts API errors inside the JSON body.
        if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
            console.error(`Google API Status Exception: [${data.status}] - ${data.error_message || 'No message provided'}`);
            
            // Mask detailed provider errors from frontend users for app security
            return res.status(502).json({ 
                success: false, 
                error: "The downstream map service encountered an issue. Please try again later." 
            });
        }

        // MoSCoW: Successful JSON processing loop fallback handled by frontend
        // Send a sanitized, predictable JSON layout structure to your HTML dashboard
        return res.status(200).json({ 
            success: true, 
            results: data.results 
        });

    } catch (error) {
        // 7. ROBUST ERROR HANDLING: Server/Timeout/Network Connection Failures
        console.error("Internal Request Failure details:", error.message);
        
        return res.status(500).json({ 
            success: false, 
            error: "An unexpected error occurred while communicating with the pizza database engine." 
        });
    }
});

// 8. SOFTWARE COMPLETENESS: Live Health Check for Render Deployment Pipeline
app.get('/health', (req, res) => {
    res.status(200).json({ status: "healthy", timestamp: new Date() });
});

// Start application listener
app.listen(PORT, () => {
    console.log(`🚀 Pizza Radar Proxy Web Service online on port ${PORT}`);
});
