import AppController from "./Controller/AppController"
import { EmailQueue } from "./MessagingQueues/EmailQueue";
import { NodeMailer } from "./MessagingQueues/NodeMailer";
import { MongoDBClient } from "./Models/MongoDBClient";
import { RedisClient } from "./RedisClient";

// configuration ----------------------------------------------------------------
require('dotenv').config();
const express = require("express");
const app = express();
const worker = express();
const cors = require('cors')  
const port = process.env.PORT || 8939
const workerPort = 9000
const AppControllerObject = new AppController()
export const MongoClientObj = new MongoDBClient();
export const RedisClientObj = new RedisClient()
export const NodeMailerObj = new NodeMailer()
export const EmailQueueObj = new EmailQueue();
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
  EmailQueueObj.create(RedisClientObj.client)
  console.log(`Server running on port : ${port} 🚀🚀🚀`)
})

