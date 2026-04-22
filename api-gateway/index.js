const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

// // --- සර්විස් වල පාරවල් (Target URLs) ---
// const AUTH_SERVICE = 'http://auth-alb-1706945340.eu-north-1.elb.amazonaws.com';
// const ORDER_SERVICE = 'http://order-alb-1411336470.eu-north-1.elb.amazonaws.com';
// const SHOP_SERVICE = 'http://shop-alb-1163828963.eu-north-1.elb.amazonaws.com';


const AUTH_SERVICE = 'http://auth-alb-1666988854.eu-north-1.elb.amazonaws.com';
const ORDER_SERVICE = 'http://order-alb-1005949791.eu-north-1.elb.amazonaws.com';
const SHOP_SERVICE = 'http://shop-alb-883151970.eu-north-1.elb.amazonaws.com';
// 1. Auth Service - පාර වෙනස් නොකර සම්පූර්ණයෙන්ම යැවීමට
app.use('/api/auth', createProxyMiddleware({
    target: AUTH_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/': '/api/auth/' } // /api/auth කෑල්ල නැවත එකතු කරයි
}));

// 2. Order Service
app.use('/api/order', createProxyMiddleware({
    target: ORDER_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/': '/api/order/' }
}));

// 3. Shop Service 
app.use('/api/shops', createProxyMiddleware({
    target: SHOP_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/': '/api/shops/' }
}));

// 4. Products Service
app.use('/api/products', createProxyMiddleware({
    target: SHOP_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/': '/api/products/' }
}));

// Gateway එක වැඩද බලන්න පොඩි පණිවිඩයක්
app.get('/', (req, res) => {
    res.send('API Gateway is running and routing requests properly!');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});