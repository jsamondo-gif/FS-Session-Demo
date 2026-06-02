// 1. Bring in our tools
require('dotenv').config(); 
const express = require('express'); 

// 2. Initialize the server
const app = express();
const PORT = 3000; 

// This acts as a translator so your server can read the JSON form data from your webpage
app.use(express.json());

// 3. Serve the Frontend Webpage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// 4. The FastSpring API Route
app.post('/create-session', async (req, res) => {
    try {
        // Grab the form data sent from your index.html webpage
        const { firstName, lastName, email } = req.body;

        // Grab our secret keys from your .env vault
        const storePath = process.env.FASTSPRING_STORE_PATH;
        const username = process.env.FASTSPRING_API_USERNAME;
        const password = process.env.FASTSPRING_API_PASSWORD;

        // FastSpring requires Basic Auth (Username:Password converted to Base64)
        const authString = Buffer.from(`${username}:${password}`).toString('base64');
        const url = `https://api.fastspring.com/v2/checkouts/${storePath}/sessions`;

        // The actual FastSpring Payload with the Sith Holocron and Custom Pricing!
        const payload = {
            customer: {
                billToContact: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email
                }
            },
            cart: {
                lineItems: [
                    {
                        productPath: "sith-holicron", 
                        quantity: 1,
                        // Override the dashboard price to force it to $99.99
                        customPrice: {
                            unitPrice: {
                                USD: 99.99
                            }
                        }
                    }
                ]
            }
        }; 

        // Fire the request to FastSpring
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        // Convert FastSpring's response into JSON
        const data = await response.json();

        // Send FastSpring's response straight to your browser screen
        res.json(data);

    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("The API call failed.");
    }
});

// 5. Turn the engine on
app.listen(PORT, () => {
    console.log(`Success! Server is actively listening on http://localhost:${PORT}`);
});