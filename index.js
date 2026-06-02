require('dotenv').config(); 
const express = require('express'); 

const app = express();
const PORT = 3000; 

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/create-session', async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;

        const storePath = process.env.FASTSPRING_STORE_PATH;
        const username = process.env.FASTSPRING_API_USERNAME;
        const password = process.env.FASTSPRING_API_PASSWORD;

        const authString = Buffer.from(`${username}:${password}`).toString('base64');
        const url = `https://api.fastspring.com/v2/checkouts/${storePath}/sessions`;

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
                        customPrice: {
                            unitPrice: {
                                USD: 99.99
                            }
                        }
                    }
                ]
            }
        }; 

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("The API call failed.");
    }
});

app.listen(PORT, () => {
    console.log(`Server is actively listening on port ${PORT}`);
});
