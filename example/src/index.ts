import "reflect-metadata";
import express from "express";
import { combineControllers } from "pretty-express";
import SampleController from "./SampleController";
import {registerValidationErrorHandler,customValidatorOptions } from "pretty-express-validate"
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// app.use(customValidatorOptions({
//   whitelist : true,
//   forbidNonWhitelisted : false,

// }))



const router = combineControllers([new SampleController()]);
app.use(router);

app.use(registerValidationErrorHandler())


app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
