const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port =process.env.PORT||5000;

// middlewere

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.TB_USER}:${process.env.TB_PASS}@cluster0.lcvsatz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

const tourismCollection = client.db('tourismDB').collection('tourism')

app.get('/tourism', async(req,res) =>{
  const cursor = tourismCollection.find();
  const result = await cursor.toArray();
  res.send(result);
})
 
app.post('/tourism',async(req,res)=>{
  const tourism = req.body;
  console.log(tourism);
  const result = await tourismCollection.insertOne(tourism);
  res.send(result);
})



    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req,res) =>{
    res.send('Tourism Bangladesh Server')
})
app.listen(port, ()=>{
    console.log(`Tourism Bangladeshis running: ${port}`);
});

