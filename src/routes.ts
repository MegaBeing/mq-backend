import AppController from "./Controller/AppController"
import { MongoDBClient } from "./Models/Client";
import { RedisClient } from "./RedisClient";

// configuration ----------------------------------------------------------------
require('dotenv').config();
const express = require("express");
const app = express();
const cors = require('cors')  
const port = process.env.PORT || 8939
const AppControllerObject = new AppController()
export const MongoClientObj = new MongoDBClient();
export const RedisClientObj = new RedisClient()
// ----------------------------------------------------------------

// Middleware 
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
})
)
app.use(express.json())

// Routes------------------------------------------------------------

app.post("/queue", AppControllerObject.ValidateNdExecuteEmailQ);

app.get("/query", AppControllerObject.Query);

// ---------------------------------------------------------------------------

app.listen(port, async () => {
  await MongoClientObj.create_connection();
  await RedisClientObj.create_connection();
  console.log(`Server running on port : ${port} 🚀🚀🚀`)
})

