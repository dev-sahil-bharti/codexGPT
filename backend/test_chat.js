async function testChat() {
    console.log("Sending test request to http://localhost:5000/api/chat...");
    try {
        const response = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: "Hello, confirm you are working." })
        });

        const data = await response.json();
        console.log("\n--- API Response ---");
        console.log("Status Code:", response.status);
        console.log("Body:", JSON.stringify(data, null, 2));
        console.log("--------------------\n");

        if (response.ok) {
            console.log("✅ Success! The API is working correctly.");
        } else {
            console.log("❌ Error! The API returned an error status.");
            console.log("Possible causes: missing API key, billing not enabled, or invalid model name.");
        }

    } catch (error) {
        console.error("\n❌ Request Failed:", error.message);
        console.log("Ensure the server is running on port 5000.");
    }
}

testChat();
