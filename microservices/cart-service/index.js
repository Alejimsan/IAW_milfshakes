const express = require('express');
const cors = require('cors');
const app=express();
app.use(cors());
app.use(express.json());

app.get('/health',(req,res)=>res.json({status:'cart healthy'}));

app.post('/cart/add',(req,res)=>{
  // placeholder
  res.json({success:true,cartTotal:0,items:[]});
});

const PORT=process.env.PORT||3003;
app.listen(PORT,()=>console.log(`Cart service running on ${PORT}`));