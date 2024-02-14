import { AuthGuard } from '@nestjs/passport';

export class LocalAdminAuthGuard extends AuthGuard('local') {}
