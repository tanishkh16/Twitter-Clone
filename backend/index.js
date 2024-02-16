import express from 'express';
import cors from 'cors';
import { MongoClient, ServerApiVersion } from 'mongodb';
import stripe from "stripe";
import jwt from 'jsonwebtoken';
const app = express();
const port = 5000;


const stripeInstance=stripe("sk_test_51OHAA3SETXDcTTgLQ0xIsrhaU2mErakLOqnYZwAiLDZrNjtlg1KkZMEtKLcXSgMSgm0mL2gg26cHgqpN3MlV0zX300REwBnmu3")

app.use(cors());
app.use(express.json());
app.use(express.json());
app.use(cors(
    {
        origin:["https://twitter-clone-xi-one.vercel.app/"],
        methods:["GET","POST","PUT","DELETE"],
        credentials:true
    }
));

const uri = `mongodb+srv://Tanish:Tanish@cluster0.gfaqfbu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1  });

async function run() {
    try {
        await client.connect();
        const postCollection = client.db("database").collection("posts"); // this collection is for team-ekt
        const userCollection = client.db("database").collection("users"); // this collection is for team-srv
console.log('connected to database');
        // get
        app.get('/user', async (req, res) => {
            const user = await userCollection.find().toArray();
            res.send(user);
        })
        app.get('/userInfo',async(req,res)=>{  
        })
        
        app.get('/loggedInUser', async (req, res) => {
            const email = req.query.email;
            const user = await userCollection.find({ email: email }).toArray();
            res.send(user);
        })
        app.get('/post', async (req, res) => {
            const post = (await postCollection.find().toArray()).reverse();
            res.send(post);
            // res.send("hello")
        })
        app.get('/userPost', async (req, res) => {
            const email = req.query.email;
            const post = (await postCollection.find({ email: email }).toArray()).reverse();
            res.send(post);
        })

        // post

        app.post('/login', async (req, res) => {
            const idToken=req.body.userId;
            const email=idToken._tokenResponse.email
            const name=idToken._tokenResponse.firstName
            const username=email.replace('@gmail.com', '');
            console.log(email);
            console.log(name);
            console.log(username)
            try {
                const foundUser = await userCollection.findOne({ email: email });
                // console.log(foundUser);
                if(!foundUser){
                    const user = {
                        email: email,
                        username: username,
                        name: name,
                        badge: false,
                        plan:"1"
                    }
                    const result = await userCollection.insertOne(user);
                    console.log(user);
                    res.send(result);
                
                }
            }catch(error){
                console.log('error');
            }
            
        })
        app.post('/register', async (req, res) => {
            const user = req.body;
            user.badge = false;
            user.plan="1"
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        app.post('/post', async (req, res) => {
            const post = req.body;
            const result = await postCollection.insertOne(post);
            res.send(result);
        })

       
      

        app.post('/badge', async (req, res) => {
        
            const userEmail = req.body.email;

            console.log(userEmail);
            const session=await stripeInstance.checkout.sessions.create({
                payment_method_types:["card"],
                line_items:[{
                    price_data:{
                        currency:"inr",
                        product_data:{
                            name:"verification badge"
                        },
                        unit_amount:999*100
                    },
                    quantity:1
                    }],
                    mode:"payment",
                    success_url: `http://localhost:3000/success?email=${encodeURIComponent(userEmail)}`,

                    cancel_url: 'http://localhost:3000/badge',
 
        })
        res.json({id:session.id});
        console.log("hello")
        

    })
    app.post("/create-checkout-session-gold", async (req, res) => {
        const session=await stripeInstance.checkout.sessions.create({
            payment_method_types:["card"],
            line_items:[{
                price_data:{
                    currency:"inr",
                    product_data:{
                        name:"verification badge"
                    },
                    unit_amount:999*100
                },
                quantity:1
                }],
                mode:"payment",
                success_url: 'http://localhost:3000/premium',
                cancel_url: 'http://localhost:3000/',

    })
    res.json({id:session.id});
    console.log("hello")
      });
      app.post("/create-checkout-session-silver", async (req, res) => {
        const session=await stripeInstance.checkout.sessions.create({
            payment_method_types:["card"],
            line_items:[{
                price_data:{
                    currency:"inr",
                    product_data:{
                        name:"verification badge"
                    },
                    unit_amount:800*100
                },
                quantity:1
                }],
                mode:"payment",
                success_url: 'http://localhost:3000/premium',
                cancel_url: 'http://localhost:3000/',

    })
    res.json({id:session.id});
    console.log("hello")
      });
    app.put('/update-badge', async (req, res) => {
        try {
            const { email } = req.query; // Extract email from query parameters
            const user = await userCollection.findOne({ email });
    
            if (user) {
                const updatedUser = await userCollection.updateOne(
                    { email },
                    { $set: { badge: true } }
                );
    
                res.json(updatedUser);
                
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

    

    

        // patch
        app.patch('/userUpdates/:email', async (req, res) => {
            const filter = req.params;
            const profile = req.body;
            const options = { upsert: true };
            const updateDoc = { $set: profile };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })


    } catch (error) {
        console.log(error);
    }
} run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello from Twitter Clone!')
})

app.listen(5000, () => {
    console.log(`Twitter clone is listening on port ${port}`)
})