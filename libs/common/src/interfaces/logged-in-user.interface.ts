import { User } from '@app/users/entities';

export interface LoggedInUserInterface extends User {
  session_id: string;
}
