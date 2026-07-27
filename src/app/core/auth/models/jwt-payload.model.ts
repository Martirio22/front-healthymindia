export interface JwtRealmAccess {
  roles: string[];
}

export interface JwtResourceAccessItem {
  roles: string[];
}

export interface JwtPayload {
  sub: string;
  exp: number;
  iat: number;
  auth_time?: number;

  preferred_username?: string;
  email?: string;
  email_verified?: boolean;
  given_name?: string;
  family_name?: string;
  name?: string;

  realm_access?: JwtRealmAccess;
  resource_access?: Record<string, JwtResourceAccessItem>;

  scope?: string;
  session_state?: string;
  sid?: string;
  typ?: string;
  azp?: string;
  iss?: string;
  aud?: string | string[];
}
