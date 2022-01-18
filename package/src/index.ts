import { ClassConstructor } from "class-transformer";
import { ValidationError, ValidatorOptions } from "class-validator";
import { NextFunction, Response, Request } from "express";
import { ICustomRequest } from "interfaces";
import { createMiddlewareDecorator, HttpErrorResponse } from "pretty-express";
import { IErrorMiddleware } from "pretty-express";
import { generateValidationMiddleware } from "./validationMiddleware";

export const validate = createMiddlewareDecorator<
  [schema: ClassConstructor<any>, options?: ValidatorOptions]
>((args) => {
  return generateValidationMiddleware(args[0], args[1]);
});

export const registerValidationErrorHandler = (handler?: {
  options?: {
    defaultErrorMessage?: string;
  };
  callback?: (
    errors: ValidationError[],
    req: Request,
    res: Response,
    next: NextFunction
  ) => any;
}): IErrorMiddleware => {
  return (err, req, res, next) => {
    // condition for validation error
    if (err instanceof Array && err[0] instanceof ValidationError) {
      let text = "An error occured while validating the response body"; //default text to send in error message
      if (handler) {
        if (handler.options && handler.options.defaultErrorMessage) {
          text = handler.options.defaultErrorMessage; //custom text to send in error message
        }

        if (handler.callback) {
          // if a callback is passed use the callback
          handler.callback(err, req, res, next);
        } else {
          return res.status(400).json({
            message: text,
            error: err,
          });
        }
      } else {
        return res.status(400).json({
          message: text,
          error: err,
        });
      }
    } else {
      // if not a validation error go to next middleware
      next(err);
    }
  };
};

export const customValidatorOptions = (validatorOptions: ValidatorOptions) => {
  return (req: ICustomRequest, res: Response, next: NextFunction) => {
    req.customValidatorOptions = validatorOptions;
    next();
  };
};
