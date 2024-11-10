import Email from "./Controller/Email"

const bodyparser = require('body-parser')
const express = require("express");
const app = express();
const port = process.env.PORT || 8939
const emailObject = new Email()

// Middleware to validate request body
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

app.post("/", (req:any , res: any) => emailObject.ValidateNdExecuteEmailQ(req,res));
app.listen(port, () => {
    console.log(`Application running on Port : ${port}`)
  })