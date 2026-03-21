// gateway.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --------------------
// CORS config
// --------------------
const allowedOrigins = [
  'http://localhost:5173', // local frontend
  'http://frontend-nethmi.s3-website.eu-north-1.amazonaws.com' // deployed frontend
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow Postman/server requests
    if (allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error('CORS not allowed from this origin'));
  },
  credentials: true
}));

// --------------------
// Backend service URLs
// --------------------
const AUTH_SERVICE = 'http://auth-alb-1706945340.eu-north-1.elb.amazonaws.com';
const ORDER_SERVICE = 'http://order-alb-1411336470.eu-north-1.elb.amazonaws.com';
const SHOP_SERVICE = 'http://shop-alb-1163828963.eu-north-1.elb.amazonaws.com';

// --------------------
// Proxy routes
// --------------------
app.use('/api/auth', createProxyMiddleware({
  target: AUTH_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '' } // removes /api/auth before sending to backend
}));

app.use('/api/order', createProxyMiddleware({
  target: ORDER_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api/order': '' }
}));

app.use('/api/shops', createProxyMiddleware({
  target: SHOP_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api/shops': '' }
}));

app.use('/api/products', createProxyMiddleware({
  target: SHOP_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/api/products': '' }
}));

// Gateway test
app.get('/', (req, res) => {
  res.send('API Gateway is running!');
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});