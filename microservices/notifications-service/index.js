const express = require('express');
const cors = require('cors');
const app=express();
app.use(cors());
app.use(express.json());

app.get('/health',(req,res)=>res.json({status:'notifications healthy'}));

app.post('/notify',(req,res)=>{
  // send email/push (placeholder)
  res.json({sent:true});
});

const PORT=process.env.PORT||3006;
app.listen(PORT,()=>console.log(`Notifications service on ${PORT}`));