import { STATUS_CODES } from "http";
import { RequestBody, ValidationResponseBody } from "./utils";
import validateEmail from "./Controller/validateEmail";

const bodyparser = require('body-parser')
const express = require("express");
const app = express();
const port = 8000

app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())


// Middleware to verify its an email

app.get("/", function(req: any, res: any) {
    try{
        const EmailValidation: Promise<Boolean> = validateEmail(req)
        if(!EmailValidation)
            throw new Error('This is not a valid email"')
        res.status(STATUS_CODES.ok)
        res.json(
            {
                status: STATUS_CODES.ok,
                message: "Sending Messages to the user"
            }
        )
        res.end()
    }
    catch(error){
        res.json({status: 500, message: error})
        res.end()
    }
        
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })