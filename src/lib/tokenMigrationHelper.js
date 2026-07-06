/**
 * Token Migration Helper
 * 
 * This utility detects old/invalid tokens from before the JWT migration
 * and automatically logs users out so they can re-authenticate with fresh tokens.
 */

import { tokenStorage } from '@/api/base44Client';
import { apiClient } from '@/api/base44Client';

export const tokenMigrationHelper = {
    /**
     * Check if the current token is valid by making a test API call.
     * If invalid, automatically clear tokens and redirect to login.
     */
    async validateAndMigrateToken(): Promise<boolean> {
        const accessToken = tokenStorage.getAccessToken();
        const refreshToken = tokenStorage.getRefreshToken();

        if (!accessToken && !refreshToken) {
            // No tokens, user needs to login
            return false;
        }

        try {
            // Try to fetch courses (or any protected endpoint) to validate token
            await apiClient.get('/courses', { params: { limit: 1 } });
            return true; // Token is valid
        } catch (error: any) {
            // Check if it's an auth error (401/403)
            if (error.response?.status === 401 || error.response?.status === 403) {
                console.log('🔄 Detected invalid/old token. Clearing and redirecting to login...');

                // Clear all auth data
                tokenStorage.clearTokens();

                // Force redirect to login
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login?reason=token_expired';
                }

                return false;
            }

            // Some other error, let it propagate
            throw error;
        }
    },

    /**
     * Force logout and redirect to login page.
     */
    forceLogout(reason = 'session_expired'): void {
        console.log(`🚪 Force logout: ${reason}`);
        tokenStorage.clearTokens();
        window.location.href = `/login?reason=${reason}`;
    }
};
