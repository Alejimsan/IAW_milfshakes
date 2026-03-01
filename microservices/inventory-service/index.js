const express = require('express');
const cors = require('cors');
const app=express();
app.use(cors());
app.use(express.json());

app.get('/health',(req,res)=>res.json({status:'inventory healthy'}));

app.get('/stock',(req,res)=>{
  res.json({productId:1,quantity:100});
});

const PORT=process.env.PORT||3004;
app.listen(PORT,()=>console.log(`Inventory service on ${PORT}`));