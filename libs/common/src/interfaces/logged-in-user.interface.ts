import { User } from '../../../../src/modules/users/entities/user.entity';

export interface LoggedInUserInterface extends User {
  session_id?: string;
}
