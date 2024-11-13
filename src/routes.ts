import AppController from "./Controller/AppController"
import { MongoDBClient } from "./Models/Client";

// configuration ----------------------------------------------------------------
require('dotenv').config();
const express = require("express");
const app = express();
const cors = require('cors')
const port = process.env.PORT || 8939
const AppControllerObject = new AppController()
export const MongoClientObj = new MongoDBClient();
MongoClientObj.create_connection();
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

// ---------------------------------------------------------------------------

app.listen(port, () => {
  console.log(`Application running on Port : ${port}`)
})

// Server Termination

// process.on('SIGINT', MongoClientObj.gracefulShutdown);    
// process.on('SIGTERM', MongoClientObj.gracefulShutdown);   
// process.on('SIGUSR2', MongoClientObj.gracefulShutdown);

// process.on('uncaughtException', async (err) => {
//     console.error("Uncaught Exception:", err);
//     await MongoClientObj.close_connection();
//     process.exit(1);
// });

// process.on('unhandledRejection', async (reason, promise) => {
//     console.error("Unhandled Rejection at:", promise, "reason:", reason);
//     await MongoClientObj.close_connection();
//     process.exit(1);
// });