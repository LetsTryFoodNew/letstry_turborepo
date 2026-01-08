import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID, GraphQLISODateTime } from '@nestjs/graphql';

export type CategorySeoDocument = CategorySeo & Document;

@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})
@ObjectType()
export class CategorySeo {
    @Field(() => ID)
    _id: string;

    @Prop({ required: true })
    @Field()
    categoryId: string;

    @Prop()
    @Field({ nullable: true })
    metaTitle?: string;

    @Prop()
    @Field({ nullable: true })
    metaDescription?: string;

    @Prop({ type: [String], default: [] })
    @Field(() => [String])
    metaKeywords: string[];

    @Prop()
    @Field({ nullable: true })
    canonicalUrl?: string;

    @Prop()
    @Field({ nullable: true })
    ogTitle?: string;

    @Prop()
    @Field({ nullable: true })
    ogDescription?: string;

    @Prop()
    @Field({ nullable: true })
    ogImage?: string;

    @Field(() => GraphQLISODateTime)
    createdAt: Date;

    @Field(() => GraphQLISODateTime)
    updatedAt: Date;
}

export const CategorySeoSchema = SchemaFactory.createForClass(CategorySeo);

CategorySeoSchema.virtual('id').get(function (this: any) {
    return this._id.toString();
});

CategorySeoSchema.index({ categoryId: 1 }, { unique: true });
