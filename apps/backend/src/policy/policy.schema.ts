import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID, GraphQLISODateTime } from '@nestjs/graphql';
import { PolicySeo } from './policy-seo.schema';

export type PolicyDocument = Policy & Document;

@Schema({ timestamps: true })
@ObjectType()
export class Policy {
  @Field(() => ID)
  _id: string;

  @Prop({ required: true, unique: true })
  @Field()
  title: string;

  @Prop({ required: true })
  @Field()
  content: string;

  @Prop({ required: true, unique: true })
  @Field()
  type: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;

  @Field(() => PolicySeo, { nullable: true })
  seo?: PolicySeo;
}

export const PolicySchema = SchemaFactory.createForClass(Policy);

PolicySchema.virtual('id').get(function (this: any) {
  return this._id?.toString();
});

PolicySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (_: any, ret: any) {
    if (ret._id) {
      ret.id = ret._id.toString();
      delete ret._id;
    }
    delete ret.__v;
  },
});
