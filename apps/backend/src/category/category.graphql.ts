import { ObjectType, Field, ID } from '@nestjs/graphql';
import { CategorySeo } from './category-seo.schema';

@ObjectType()
export class Category {
  @Field(() => ID)
  _id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  parentId?: string;

  @Field({ nullable: true })
  favourite?: boolean;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field()
  codeValue: string;

  @Field()
  inCodeSet: string;

  @Field()
  productCount: number;

  @Field()
  isArchived: boolean;

  @Field(() => [require('../product/product.graphql').Product], {
    nullable: true,
  })
  products?: any[];

  @Field(() => CategorySeo, { nullable: true })
  seo?: CategorySeo;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
