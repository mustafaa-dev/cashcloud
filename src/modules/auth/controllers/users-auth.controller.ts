import { Controller } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Controller('auth')
export class UsersAuthController {
  constructor(private readonly authService: AuthService) {}
}
