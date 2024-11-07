import {
  ArgumentMetadata,
  BadGatewayException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: string, _metadata: ArgumentMetadata) {
    if (!isValidObjectId(value)) {
      throw new BadGatewayException(`${value} is not a valid MongoID`);
    }
    return value;
  }
}
