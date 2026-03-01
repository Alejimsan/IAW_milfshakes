const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const app = express();
app.use(cors());

// simple routing rules
app.use('/catalog', createProxyMiddleware({ target: 'http://catalog-service:3001', changeOrigin: true }));
app.use('/auth', createProxyMiddleware({ target: 'http://auth-service:3002', changeOrigin: true }));
app.use('/cart', createProxyMiddleware({ target: 'http://cart-service:3003', changeOrigin: true }));
app.use('/inventory', createProxyMiddleware({ target: 'http://inventory-service:3004', changeOrigin: true }));
app.use('/payments', createProxyMiddleware({ target: 'http://payments-service:3005', changeOrigin: true }));
app.use('/notify', createProxyMiddleware({ target: 'http://notifications-service:3006', changeOrigin: true }));

app.get('/health', (req,res)=>res.json({status:'gateway healthy'}));

const PORT=process.env.PORT||3000;
app.listen(PORT,()=>console.log(`API Gateway listening on ${PORT}`));