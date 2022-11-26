import { ApiProperty } from '@nestjs/swagger';
export class RegisterResponse {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  fisrtName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
