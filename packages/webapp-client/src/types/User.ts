export interface User {
  /**
   * The user's email address
   */
  email: string;
  /**
   * The user's auth provider (local, google, github)
   */
  provider: 'local' | 'google' | 'github';
  /**
   * The user's auth provider ID (only required if using a non-local auth strategy)
   */
  providerId?: string;
  /**
   * The user's avatar URL, if provided by the auth provider
   */
  avatar?: string;
}
