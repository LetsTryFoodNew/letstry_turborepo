import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field } from '@nestjs/graphql';

@Schema({ _id: false })
@ObjectType()
export class SeoBase {
    @Prop()
    @Field({ nullable: true })
    metaTitle?: string;

    @Prop()
    @Field({ nullable: true })
    metaDescription?: string;

    @Prop({ type: [String], default: [] })
    @Field(() => [String], { nullable: true })
    metaKeywords?: string[];

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
}

export const SeoBaseSchema = SchemaFactory.createForClass(SeoBase);
