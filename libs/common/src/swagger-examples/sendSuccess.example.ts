import { ApiResponseProperty } from '@nestjs/swagger';

export class SuccessResponse {
  @ApiResponseProperty()
  status: string;

  @ApiResponseProperty()
  statusCode: number;

  @ApiResponseProperty()
  message: string;

  @ApiResponseProperty()
  data: any;
}
