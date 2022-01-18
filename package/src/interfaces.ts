import { ValidatorOptions } from "class-validator";
import { Request } from "express";
export interface ICustomRequest extends Request{
    customValidatorOptions ?: ValidatorOptions
}