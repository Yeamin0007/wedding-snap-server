const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.Port || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1luet9i.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('weddingSnap').collection('services');

        app.get('/services', async(req,res)=>{
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services)
        })
        
        app.get('/allservices', async(req,res)=>{
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
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