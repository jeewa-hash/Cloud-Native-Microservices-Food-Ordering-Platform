const axios = require('axios');

async function test() {
    try {
        // 1. Get token
        const authRes = await axios.post('http://localhost:5002/api/auth/login', {
            userName: "amanda", // I know "amanda" is an admin from earlier screenshots
            password: "password123" // Guessing password or we can fetch a shop user
        });
        const token = authRes.data.token;
        console.log("Got token!");

        // 2. Add product
        const payload = {
            name: 'Belt',
            price: '1200.00',
            description: 'New Belt for Mens',
            image: 'https://...',
            category: 'Clothing',
            isAvailable: true,
            shopId: authRes.data.user.id // This simulates the selectedShop.id
        };

        const response = await axios.post('http://localhost:4040/api/products', payload, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("SUCCESS:", response.data);
    } catch (e) {
        if (e.response) {
            console.error("HTTP ERROR:", e.response.status, e.response.data);
        } else {
            console.error("NETWORK ERROR:", e.message);
        }
    }
}
test();
