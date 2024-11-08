import { Request } from "express"; 
import { STATUS_CODES } from "http"; 
import { RequestBody, ValidationResponseBody } from "../utils";

const validateEmail = async (req: Request)=> {
  try {
    const data: RequestBody = req.body;
    const isEmail = /^[\w-\.]+@([\w-]+\.)+(com|in)$/i.test(data.email);
    if (!isEmail) 
      throw new Error('invalid Email')
  } catch (error: any) {
    throw error
  }
};

export default validateEmail;
