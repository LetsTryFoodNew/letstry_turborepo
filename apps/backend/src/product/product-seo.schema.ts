import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID, GraphQLISODateTime } from '@nestjs/graphql';
import { SeoBase } from '../seo-core/seo-base.schema';

export type ProductSeoDocument = ProductSeo & Document;

@Schema({ timestamps: true })
@ObjectType()
export class ProductSeo extends SeoBase {
  @Field(() => ID)
  _id: string;

  @Prop({ required: true })
  @Field()
  productId: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}

export const ProductSeoSchema = SchemaFactory.createForClass(ProductSeo);

ProductSeoSchema.index({ productId: 1 }, { unique: true });
