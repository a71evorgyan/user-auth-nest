import { ApiProperty } from '@nestjs/swagger';

export class UserInfoResponse {
  @ApiProperty()
  fisrtName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;
}
