import Email from "./Controller/Email"

const express = require("express");
const app = express();
const port = process.env.PORT || 8939
const emailObject = new Email()

// Middleware to validate request body
app.use(express.json())

app.post("/", emailObject.ValidateNdExecuteEmailQ);
app.listen(port, () => {
    console.log(`Application running on Port : ${port}`)
  })