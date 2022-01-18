import { Type } from "class-transformer";
import { IsDefined, IsOptional, IsString, ValidateNested } from "class-validator";
import { controller, post, reqBody } from "pretty-express";
import { validate } from "pretty-express-validate";

class SampleSchema {
  @IsString()
  prop1: string;

  @IsOptional()
  @IsString()
  prop2: string;
}


class NestedObj {
  @IsString()
  name : string
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
  nested : NestedObj;
}





@controller("/test")
export default class SampleController {
  @validate(SampleSchema)
  @post("/1")
  g1(@reqBody body : SampleSchema) {
      return body;
  }

  @validate(SampleSchema2)
  @post("/2")
  g(@reqBody body : SampleSchema) {
      return body;
  }
}
