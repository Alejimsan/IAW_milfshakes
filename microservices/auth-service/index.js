const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({status:'auth healthy'}));

app.post('/login', (req, res) => {
  const {username,password} = req.body;
  // placeholder authentication
  const token = jwt.sign({user:username}, process.env.JWT_SECRET||'secret');
  res.json({token});
});

const PORT=process.env.PORT||3002;
app.listen(PORT,()=>console.log(`Auth service on ${PORT}`));