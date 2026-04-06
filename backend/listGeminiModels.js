const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const fs = require('fs');

async function run() {
    try {
        const apiKey = process.env.GOOGLE_API_KEY;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        if (!response.ok) {
            console.error(`Error fetching models: ${response.status} ${response.statusText}`);
            return;
        }

        const data = await response.json();
        const modelNames = data.models ? data.models.map(m => m.name) : [];

        fs.writeFileSync('models_list.json', JSON.stringify(modelNames, null, 2), 'utf8');
        console.log("Models written to models_list.json");

    } catch (error) {
        console.error("Error:", error);
    }
}

run();