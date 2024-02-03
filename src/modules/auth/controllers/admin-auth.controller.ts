import { Controller, Post } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login() {}
}
