import { Type } from "class-transformer";
import {
  IsDefined,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { reqBody, controller, post } from "pretty-express";
import { validate } from "../../../";

class SampleSchema {
  @IsString()
  prop1: string;

  @IsOptional()
  @IsString()
  prop2: string;
}

class NestedObj {
  @IsString()
  name: string;
}

class SampleSchema2 {
  @IsString()
  prop1: string;

  @IsOptional()
  @IsString()
  prop2: string;

  @ValidateNested()
  @Type()
  @IsDefined()
  nested: NestedObj;
}

@controller("/test")
export default class SampleErrorController {
  @validate(SampleSchema)
  @post("/1")
  g1(@reqBody body: SampleSchema) {
    return body;
  }

  @validate(SampleSchema2)
  @post("/2")
  g(@reqBody body: SampleSchema) {
    return body;
  }
}
