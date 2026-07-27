import { UserStatus } from "./user-status.enum";

export interface UserResponse {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  registrationDate: string;
  status: UserStatus;
}
