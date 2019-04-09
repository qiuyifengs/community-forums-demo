import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDto } from './dto.base';

export class TransferDto extends BaseDto {

    @ApiModelProperty({description: 'from address'})
    from: string;

    @ApiModelProperty({description: 'to address'})
    to: string;

    @ApiModelProperty({description: 'amount'})
    amount: string;

    @ApiModelProperty({description: '0 -> normal || 1 -> be candidate(from == to) || 2 -> quit candidate(from == to) || 3 -> from vote to || 4 -> from cancel vote to'})
    type: number = 0;

    @ApiModelProperty({description: 'is contract'})
    contract: boolean = false;

    @ApiModelProperty({description: 'concurrent'})
    concurrent: number = 1;

    @ApiModelProperty({description: 'nonce'})
    nonce: number = 0;
}
