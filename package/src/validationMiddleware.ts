import { ClassConstructor, plainToClass } from "class-transformer";
import { Validator, ValidatorOptions } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { ICustomRequest } from "interfaces";

export type IErrorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => any;
export type IMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => any;

export const generateValidationMiddleware = (
  type: ClassConstructor<any>,
  options?: ValidatorOptions
): IMiddleware => {
  let validator = new Validator();

  return (req: ICustomRequest, res, next) => {
    // custom options set on Global level
    // PRIORITY __> MIDDLEWARE LEVEL --> GLOBAL_LEVEL --> DEFAULTS
    const customValidatorOptions = req.customValidatorOptions;

    let input: any = plainToClass(type, req.body, {
      ignoreDecorators: true,
    });

    let finalOptions: ValidatorOptions = {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    };

    if (options) {
      finalOptions = options;
    } else if (customValidatorOptions) {
      finalOptions = customValidatorOptions;
    }

    // set forbid unknown as default

    let errors = validator.validateSync(input, finalOptions);

    if (errors.length > 0) {
      next(errors);
    } else {
      req.body = input;
      next();
    }
  };
};
