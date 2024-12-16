import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export interface EntityBaseInterface {
  id: number;
  created?: Date;
  updated?: Date;
  deleted?: Date;
}

export class ObjectWithID {
  @ApiProperty({ required: true, example: 1 })
  @IsInt()
  @Min(0)
  id?: number;
}
