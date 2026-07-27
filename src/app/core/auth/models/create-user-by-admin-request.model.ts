import { AuthRole } from "./auth-role.enum";

export interface CreateUserByAdminRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: AuthRole;
}
