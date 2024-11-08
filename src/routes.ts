import { STATUS_CODES } from "http";
import validateEmail from "./Controller/validateEmail";

const bodyparser = require('body-parser')
const express = require("express");
const app = express();
const port = 8000

app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

app.post("/", function(req: any, res: any) {
    try{
        validateEmail(req)
        res.status(STATUS_CODES.ok)
        res.json(
            {
                status: STATUS_CODES.ok,
                message: "Sended Messages to the user"
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