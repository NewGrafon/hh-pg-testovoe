import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ResponseItem, ResponseItems } from '@pvz-backends/shared';
import { ArticleEntity } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CacheWrapperService } from '@pvz-backends/cache-module';
import { CacheKeys } from '../../common/consts-configs/cache-keys.const';
import { UnauthorizedResponseItem } from '../../../../../libs/shared/src/lib/consts-configs/ready-responses.consts';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    private readonly cacheService: CacheWrapperService
  ) {
  }

  async create(createArticleDto: CreateArticleDto): Promise<ResponseItem<ArticleEntity>> {
    const newArticle = await this.articleRepository.save(createArticleDto);

    const allAKBCacheKeys = (await this.cacheService.getAllKeys()).filter((key) => key.startsWith('akb'));

    await Promise.all(allAKBCacheKeys.map((key) => {
      return this.cacheService.del(key);
    }));

    return Object.assign(await this.findOneById(newArticle.id, true), { message: 'Статья успешно создана!' });
  }

  async findAll(userAuthorized: boolean): Promise<ResponseItems<ArticleEntity>> {
    const cachedData = (await this.cacheService.get<ArticleEntity>(CacheKeys.allArticles())) as ResponseItems<ArticleEntity>;
    if (cachedData) {
      if (!userAuthorized) {
        cachedData.items = cachedData.items.filter((article) => article.isPublic);
      }
      return cachedData as ResponseItems<ArticleEntity>;
    }

    const allArticles = await this.articleRepository.find({
      select: {
        content: false,
        deleted: false
      },
      withDeleted: false
    });

    const response: ResponseItems<ArticleEntity> = {
      success: true,
      items: allArticles
    };

    await this.cacheService.set<ArticleEntity>(CacheKeys.allArticles(), response, 600);

    if (!userAuthorized) {
      response.items = response.items.filter((article) => article.isPublic);
    }

    return response;
  }

  async findAllByTags(tags: unknown[], userAuthorized: boolean): Promise<ResponseItems<ArticleEntity>> {
    for (const tag of tags) {
      if (typeof tag !== 'number' || tag < 1) {
        return {
          success: false,
          items: null,
          message: 'В массиве тегов находятся не числовые значения или некоторые значения равны или ниже нуля!'
        };
      }
    }

    const allArticles = await this.findAll(userAuthorized);

    const filteredArticles = allArticles.items
      .filter(
        (article) => tags.filter((tag: number) => {
          return article.tags.includes(tag);
        }).length === tags.length
      );

    return {
      success: true,
      items: filteredArticles
    };
  }

  async findOneById(id: number, userAuthorized: boolean): Promise<ResponseItem<ArticleEntity>> {
    const cachedData = (await this.cacheService.get<ArticleEntity>(CacheKeys.articleById(id))) as ResponseItem<ArticleEntity>;
    if (cachedData) {
      if (!userAuthorized && (cachedData.item && !cachedData.item.isPublic)) {
        return UnauthorizedResponseItem;
      }
      return cachedData as ResponseItem<ArticleEntity>;
    }

    const article = await this.articleRepository.findOne({
      where: {
        id
      },
      withDeleted: false
    });

    const response: ResponseItem<ArticleEntity> = {
      success: !!article,
      item: article || null,
      message: !article ? `Статья с данным ID не найдена!` : undefined
    };

    await this.cacheService.set<ArticleEntity>(CacheKeys.articleById(id), response, 60);

    if (!userAuthorized && (article && !article.isPublic)) {
      return UnauthorizedResponseItem;
    }

    return response;
  }

  async update(id: number, updateArticleDto: UpdateArticleDto): Promise<ResponseItem<ArticleEntity>> {
    const articleExists = await this.findOneById(id, true);

    if (!articleExists) {
      return {
        success: false,
        item: null,
        message: 'Статья с данным ID не найдена!'
      };
    }

    await this.articleRepository.save(Object.assign(articleExists, updateArticleDto));

    await Promise.all([
      this.cacheService.del(CacheKeys.allArticles()),
      this.cacheService.del(CacheKeys.articleById(id))
    ]);

    return this.findOneById(id, true);
  }

  async remove(id: number): Promise<ResponseItem<null>> {
    const articleExists = await this.findOneById(id, true);

    if (!articleExists) {
      return {
        success: false,
        item: null,
        message: 'Статья с данным ID не найдена!'
      };
    }

    await this.articleRepository.softDelete({
      id
    });

    await Promise.all([
      this.cacheService.del(CacheKeys.allArticles()),
      this.cacheService.del(CacheKeys.articleById(id))
    ]);

    return {
      success: true,
      item: null,
      message: 'Статья успешно удалена!'
    };
  }
}
