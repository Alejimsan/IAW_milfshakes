// simple express server for catalog
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({status: 'catalog service healthy'});
});

app.get('/products', (req, res) => {
  // placeholder - would query DB
  res.json([{id:1,name:'Sample product',price:19.99}]);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Catalog service listening on ${PORT}`);
});