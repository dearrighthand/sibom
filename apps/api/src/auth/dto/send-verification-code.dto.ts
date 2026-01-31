import { IsString, Matches } from 'class-validator';

export class SendVerificationCodeDto {
  @IsString()
  @Matches(/^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/, {
    message: 'Invalid phone number format',
  })
  phone: string;
}
