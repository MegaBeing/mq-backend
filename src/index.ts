import { STATUS_CODES } from "http";
import { reqBody } from "./utils";
const bodyparser = require('body-parser')
const express = require("express");
const app = express();
const port = 8000

app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())


// Middleware to verify its an email

const EmailValidator = (req:any, res:any, next:any) => {
    const data:reqBody = req.body.json;
    const isEmail = data.email.search('.*@.+\.[(com)|(in)]')
}
app.get("/", function(req: any, res: any) {
    try{

        const data:reqBody = req.body.json;
        const isEmail = data.email.search('.*@.+\.[(com)|(in)]')
        if(!isEmail)
            throw new Error('this is not an email')
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