import { EntityBaseInterface } from '@testovoe/shared';

export interface CreateArticleDtoInterface {
  title: string;
  content: string;
  /**
   * Array of tags IDs
   */
  tags: number[];
  isPublic: boolean;
}

export interface UpdateArticleDtoInterface extends Partial<CreateArticleDtoInterface> {
}

export interface ArticleEntityInterface extends CreateArticleDtoInterface, EntityBaseInterface {
}
