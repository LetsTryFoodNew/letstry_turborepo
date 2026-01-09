import { InputType, Field } from '@nestjs/graphql';
import { SeoBaseInput } from '../seo-core/seo-base.input';

@InputType()
export class CreatePolicyInput {
  @Field()
  title: string;

  @Field()
  content: string;

  @Field()
  type: string;

  @Field(() => SeoBaseInput, { nullable: true })
  seo?: SeoBaseInput;
}

@InputType()
export class UpdatePolicyInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  content?: string;

  @Field({ nullable: true })
  type?: string;

  @Field(() => SeoBaseInput, { nullable: true })
  seo?: SeoBaseInput;
}
