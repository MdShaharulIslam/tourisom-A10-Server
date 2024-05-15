const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lcvsatz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    // await client.connect();

    const db = client.db('tourismDB');
    const tourismCollection = db.collection('tourism');
     
    app.get('/tourism', async (req, res) => {
      try {
        const result = await tourismCollection.find().toArray();
        res.json(result);
      } catch (error) {
        console.error("Error fetching tourism data:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.post('/tourism', async (req, res) => {
      try {
        const tourism = req.body;
        const result = await tourismCollection.insertOne(tourism);
        res.json(result.ops[0]);
      } catch (error) {
        console.error("Error inserting tourism data:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
    app.put('/tourism/:id',async(req,res)=>{
      console.log(req.params.id)
      const query ={_id:new ObjectId(req.params.id)}
      const data= {
          $set:{
              photoUrl:req.body.photoUrl ,
              countryName:req.body.countryName,
              location:req.body.location ,
              discription:req.body.discription,
              seassonality:req.body.seassonality,
              avarageCost:req.body.avarageCost,
              travelTime:req.body.travelTime,
              totalVisitorPerYear:req.body.totalVisitorPerYear
          }
      }
      const result = await tourismCollection.updateOne(query,data)
      console.log(result);
      res.send(result)
  });

    app.delete('/tourism/:id', async (req,res) =>{
      const id = req.params.id;
      const query ={_id:new ObjectId(id)}
      const result = await tourismCollection.deleteOne(query);
      res.send(result)
    })
    const corsOptions = {
      origin: ['http://localhost:5173', 'http://localhost:5174','***'],
      credentials: true,
      optionSuccessStatus: 200,
    }
    app.use(cors(corsOptions))
    app.get('/tourism/:id', async(req,res)=>{
      const id =req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await tourismCollection.findOne(query);
      res.send(result)
    })

    console.log("Connected to MongoDB");

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

  } finally {
    // Close the connection after finishing operations
    // await client.close();
  }
}

run().catch(console.error);
