const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/health',(req,res)=>res.json({status:'payments healthy'}));

app.post('/charge',(req,res)=>{
  // placeholder integration with Stripe/PayPal
  res.json({success:true,transactionId:'txn_12345'});
});

const PORT=process.env.PORT||3005;
app.listen(PORT,()=>console.log(`Payments service on ${PORT}`));