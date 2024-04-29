const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.TB_USER}:${process.env.TB_PASS}@cluster0.lcvsatz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const db = client.db('tourismDB');
    const tourismCollection = db.collection('tourism');
    

    // Route to get tourism data
    app.get('/tourism', async (req, res) => {
      try {
        const result = await tourismCollection.find().toArray();
        res.json(result);
      } catch (error) {
        console.error("Error fetching tourism data:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // Route to insert tourism data
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

    // Route to get a specific homeData document by ID
    
    

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
