const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors({
    origin:["http://localhost:5173"]
}))
app.use(express.json())

console.log(process.env.DB_USER)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ytj0kf8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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

    const spicyDB= client.db("spicyDB")
    const menuCollection = spicyDB.collection("menuCollection")
    const addToCartCollection = spicyDB.collection("addToCartCollection")

    try{
        app.get('/menus',async(req,res)=>{
            const result = await menuCollection.find().toArray()
            res.send(result)
        })
    }catch(err){
        console.log(err)
    }

    try{
      app.delete('/deleteMenu/:id',async(req,res)=>{
        const id = req.params.id;
        console.log(id)
        const query = {_id: (id)}
        const result = await menuCollection.deleteOne(query)
        res.send(result)
      })
    }catch(err){
      console.log(err)
    }

    // post addto cart
    try{
    app.post('/addToCart',async(req,res)=>{
      const item = req.body;
      const result = await addToCartCollection.insertOne(item)
      res.send(result)
    })
    }catch(err){
      console.log(err)
    }

    // get cart item
    try{
       app.get('/getCart',async(req,res)=>{
          const result = await addToCartCollection.find().toArray()
          res.send(result)
       })
    }catch(err){
      console.log(err)
    }



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('spicy restaurent project!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})