import { CreateArticleDtoInterface } from '../../../common/interfaces/articles.interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, MaxLength, MinLength } from 'class-validator';
import { IsNumberArray } from '../../../../../../libs/shared/src/lib/decorators/is-number.array';

export class CreateArticleDto implements CreateArticleDtoInterface {
  @ApiProperty({ title: 'Заголовок', example: 'Заголовок' })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  title: string;

  @ApiProperty({ title: 'Содержание', example: 'Содержание' })
  @IsString()
  @MinLength(1)
  @MaxLength(65536)
  content: string;

  @ApiProperty({ title: 'Публичный уровень доступа', example: true })
  @IsBoolean()
  isPublic: boolean;

  @ApiProperty({ title: 'Теги', example: [1] })
  @IsNumberArray({ min: 1 })
  tags: number[];
}
