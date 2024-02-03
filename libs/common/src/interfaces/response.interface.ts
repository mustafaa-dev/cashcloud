import { HttpStatus } from '@nestjs/common';

export function sendSuccess<T>(
  data: T,
  message: string = 'Success',
  statusCode: number = HttpStatus.OK,
): ApiResponse<T> {
  return {
    status: 'success',
    statusCode,
    message,
    data,
  };
}

export function sendError<T>(
  message: string,
  statusCode: number,
): ApiResponse<T> {
  return {
    status: 'error',
    statusCode,
    message,
    data: null,
  };
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  statusCode: number;
  message: string;
  data: T | null;
}
