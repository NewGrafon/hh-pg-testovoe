import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleDto } from './create-article.dto';
import { UpdateArticleDtoInterface } from '../../../common/interfaces/articles.interfaces';

export class UpdateArticleDto extends PartialType(CreateArticleDto) implements UpdateArticleDtoInterface {
}
