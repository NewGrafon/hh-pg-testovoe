import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class TagsQueryDto {
  @Type(() => String)
  @ValidateNested({ each: true })
  tags: string[];
}
