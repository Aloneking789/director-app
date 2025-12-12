/**
 * Token Management
 * Handles token storage, retrieval, and validation
 * 
 * IMPORTANT: This is a foundation for the authentication convention
 * After backend implements proper authentication, update this file
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  TOKEN: 'director_app_token',
  REFRESH_TOKEN: 'director_app_refresh_token',
  TOKEN_EXPIRES_AT: 'director_app_token_expires_at',
  USER_ID: 'director_app_user_id',
  USER_ROLE: 'director_app_user_role',
  SESSION_ID: 'director_app_session_id',
};

/**
 * Token structure for future implementation
 * Update this after backend authentication is finalized
 */
export interface TokenData {
  token: string;
  refreshToken?: string;
  expiresAt?: number;
  userId?: string;
  userRole?: string;
  sessionId?: string;
  issuedAt: number;
  convention: string; // Convention version for validation
}

class TokenManager {
  private tokenData: TokenData | null = null;

  /**
   * Initialize token manager
   * Loads token from storage on app startup
   */
  async initialize(): Promise<void> {
    try {
      const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      if (storedToken) {
        this.tokenData = JSON.parse(storedToken);
        
        // Validate token expiration
        if (this.isTokenExpired()) {
          await this.clearTokens();
        }
      }
    } catch (error) {
      console.error('Failed to initialize token manager:', error);
    }
  }

  /**
   * Store token after login
   * CONVENTION: Token will be provided by backend after authentication
   */
  async storeToken(
    token: string,
    options: {
      refreshToken?: string;
      expiresIn?: number; // seconds
      userId?: string;
      userRole?: string;
      sessionId?: string;
    } = {}
  ): Promise<void> {
    try {
      const issuedAt = Date.now();
      const expiresAt = options.expiresIn 
        ? issuedAt + (options.expiresIn * 1000)
        : issuedAt + (24 * 60 * 60 * 1000); // Default 24 hours

      this.tokenData = {
        token,
        refreshToken: options.refreshToken,
        expiresAt,
        userId: options.userId,
        userRole: options.userRole,
        sessionId: options.sessionId,
        issuedAt,
        convention: '1.0', // Current convention version
      };

      // Store in AsyncStorage
      await AsyncStorage.setItem(
        STORAGE_KEYS.TOKEN,
        JSON.stringify(this.tokenData)
      );

      if (options.userId) {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, options.userId);
      }
      if (options.userRole) {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_ROLE, options.userRole);
      }
      if (options.sessionId) {
        await AsyncStorage.setItem(STORAGE_KEYS.SESSION_ID, options.sessionId);
      }
    } catch (error) {
      console.error('Failed to store token:', error);
      throw error;
    }
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    return this.tokenData?.token || null;
  }

  /**
   * Get full token data
   */
  getTokenData(): TokenData | null {
    return this.tokenData;
  }

  /**
   * Check if token is valid
   */
  isTokenValid(): boolean {
    if (!this.tokenData) return false;
    return !this.isTokenExpired();
  }

  /**
   * Check if token is expired
   */
  private isTokenExpired(): boolean {
    if (!this.tokenData || !this.tokenData.expiresAt) {
      return true;
    }
    return Date.now() >= this.tokenData.expiresAt;
  }

  /**
   * Refresh token (for future implementation)
   * Backend will provide new token based on refresh token
   */
  async refreshToken(): Promise<boolean> {
    try {
      if (!this.tokenData || !this.tokenData.refreshToken) {
        return false;
      }

      // TODO: Implement refresh token logic with backend
      // This will depend on backend's token refresh endpoint
      console.log('Token refresh not yet implemented');
      return false;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return false;
    }
  }

  /**
   * Clear all tokens (on logout)
   */
  async clearTokens(): Promise<void> {
    try {
      this.tokenData = null;
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.TOKEN_EXPIRES_AT,
        STORAGE_KEYS.USER_ID,
        STORAGE_KEYS.USER_ROLE,
        STORAGE_KEYS.SESSION_ID,
      ]);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
      throw error;
    }
  }

  /**
   * Get user info from stored token
   */
  getUserInfo(): {
    userId?: string;
    userRole?: string;
    sessionId?: string;
  } | null {
    if (!this.tokenData) return null;

    return {
      userId: this.tokenData.userId,
      userRole: this.tokenData.userRole,
      sessionId: this.tokenData.sessionId,
    };
  }

  /**
   * Get token convention info
   * Used to verify token format and version
   */
  getTokenConvention(): string {
    return this.tokenData?.convention || 'unknown';
  }
}

// Export singleton instance
export const tokenManager = new TokenManager();

/**
 * Future Login Implementation Convention
 * 
 * When implementing login, follow this convention:
 * 
 * 1. POST /auth/login with credentials
 * 2. Backend returns:
 *    {
 *      "token": "JWT_TOKEN",
 *      "refreshToken": "REFRESH_TOKEN",
 *      "expiresIn": 86400,
 *      "user": {
 *        "id": "user123",
 *        "role": "director",
 *        "sessionId": "1026"
 *      }
 *    }
 * 3. Store token using tokenManager.storeToken(...)
 * 4. Include token in all subsequent API requests
 * 5. Handle token expiration and refresh automatically
 * 
 * Current Implementation:
 * - Uses placeholder token generation for development
 * - After login implementation, generate real tokens
 * - Ensure token validation on each request
 */
