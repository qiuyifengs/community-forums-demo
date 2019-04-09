import { Injectable } from '@nestjs/common';
import { TransferDto, BaseDto } from './dto';

@Injectable()
export class EJSService {
  public async transfer(data: TransferDto): Promise<any> {
    return data;
  }
}
