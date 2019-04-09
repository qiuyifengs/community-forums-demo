import { ApiModelProperty } from '@nestjs/swagger';

export class BaseDto {
    @ApiModelProperty({description: 'from address'})
    from: string;

    @ApiModelProperty({description: 'provider url'})
    url: string;
}
