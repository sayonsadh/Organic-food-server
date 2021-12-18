const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());




const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d4t4c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });





async function run() {
  try {
    await client.connect();
    const database = client.db("organic-food");

    //database collection
    const productsCollection = database.collection("products");
    const usersCollection = database.collection("users");
    const reviewsCollection = database.collection("reviews");
    const selectedProductCollection = database.collection("selectedProducts");

    //products get api
    app.get('/products', async (req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      console.log(products);
      console.log(cursor);
      res.send(products);
    });

    //review get api
    app.get('/reviews', async (req, res) => {
      const cursor = reviewsCollection.find({});
      const review = await cursor.toArray();
      res.send(review);
    });

    //selected product get api
    app.get('/selectedProducts', async (req, res) => {
      const cursor = selectedProductCollection.find({});
      const review = await cursor.toArray();
      res.send(review);
    });

    // //users get api
    app.get('/users', async (req, res) => {
      const cursor = usersCollection.find({});
      const review = await cursor.toArray();
      res.send(review);
    });

    //add products post API
    app.post('/products', async (req, res) => {
      const newProducts = req.body;
      const result = await productsCollection.insertOne(newProducts);
      res.json(result);
    });

    //review post api
    app.post('/reviews', async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      console.log(result);
      res.json(result);
    });

    //selected products post api collection...
    app.post('/selectedProducts', async (req, res) => {
      const food = req.body;
      const result = await selectedProductCollection.insertOne(food);
      console.log(result);
      res.json(result);
    });

    //get which users are admin
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === 'admin') {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    })

    //users information post api in database
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });

    //delete selected products api
    app.delete('/selectedProducts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await selectedProductCollection.deleteOne(query);
      console.log(result);
      res.json(result);
    });

    //delete products api
    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      console.log(result);
      res.json(result);
    })

    //order update selected bike api...
    app.put('/selectedProducts/:id', async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: status
        },
      };
      const result = await selectedProductCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });

    //user admin
    app.put('/users/admin', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: 'admin' } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    })

  }
  finally {
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Running my Organic food server')
});

app.listen(port, () => {
  console.log('Running my organic food Server on port', port);
});