import AppController from "./Controller/AppController"

// configuration ----------------------------------------------------------------
const express = require("express");
const app = express();
const port = process.env.PORT || 8939
const AppControllerObject = new AppController()
require('dotenv').config();
// ----------------------------------------------------------------

// Middleware to validate request body
app.use(express.json())

app.post("/", AppControllerObject.ValidateNdExecuteEmailQ);
app.listen(port, () => {
    console.log(`Application running on Port : ${port}`)
  })