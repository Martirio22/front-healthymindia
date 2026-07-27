export interface TokenResponse {
  accessToken: string;
  refreshToken: string | null;
  expiresIn: number;
}
