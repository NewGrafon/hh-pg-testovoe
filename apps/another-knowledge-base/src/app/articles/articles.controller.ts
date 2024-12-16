import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@testovoe/auth-module';
import { AllowAnonymous, UserId } from '@testovoe/shared';

@Controller('articles')
@ApiTags('articles')
@ApiBearerAuth('x-token')
@UseGuards(AuthGuard)
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {
  }

  @AllowAnonymous()
  @Get('')
  findAll(@UserId() userId: number | null) {
    return this.articlesService.findAll(userId !== null);
  }

  @AllowAnonymous()
  @ApiQuery({ name: 'tags', example: '1,2,3', type: String })
  @Get('by_tags')
  findAllByTags(@Query('tags', new ParseArrayPipe({
    items: Number,
    separator: ','
  })) tags: number[], @UserId() userId: number | null) {
    return this.articlesService.findAllByTags(tags, userId !== null);
  }

  @AllowAnonymous()
  @ApiParam({ name: 'id', schema: { type: 'number', example: 1 } })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @UserId() userId: number | null) {
    return this.articlesService.findOneById(id, userId !== null);
  }

  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @ApiParam({ name: 'id', schema: { type: 'number', example: 1 } })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(id, updateArticleDto);
  }

  @ApiParam({ name: 'id', schema: { type: 'number', example: 1 } })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.articlesService.remove(id);
  }
}
