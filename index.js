const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.Port || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1luet9i.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('weddingSnap').collection('services');
        const reviewCollection = client.db('weddingSnap').collection('reviews');

        app.get('/services', async(req,res)=>{
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services)
        })
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        })
        
        
        app.get('/allservices', async(req,res)=>{
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        })

        app.get('/services/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        // review sec
        app.get('/reviews', async(req, res)=>{
            let query = {};
            if( req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        app.get('/review', async(req, res)=>{
            let query = {};
            if( req.query.serviceId){
                query = {
                    serviceId: req.query.serviceId
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        app.get('/reviews/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await reviewCollection.findOne(query);
            res.send(service);
        })
        app.put('/reviews/:id', async(req, res)=>{
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const view = req.body;
            const option = {upsert: true};
            const updatedReview = {
                $set: {
                    review: view.review
                }
            }
            const result = await reviewCollection.updateOne(filter, updatedReview, option);
            res.send(result);
        })

        

        app.delete('/reviews/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally{}
}
run().catch(error => console.error(error));

app.get('/', (req,res)=>{
    res.send('snap server is running')
})

app.listen(port, ()=>{
    console.log(`snap server running on ${port}`);
})