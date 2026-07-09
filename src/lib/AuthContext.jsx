import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { tokenStorage, apiClient } from '@/api/apiClient';
import { authApi } from '@/api/authApi';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
/**
 * Decode a JWT payload without verification (verification happens server-side).
 * Returns null if token is malformed.
 */
function decodeJwtPayload(token) {
  try {
    const base64 = token.split('.')[1];
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Returns true if the token is expired (or expires within 30s).
 */
function isTokenExpired(token) {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;
  return payload.exp * 1000 < Date.now() + 30_000; // 30s buffer
}

// ---------------------------------------------------------------------------
// Role hierarchy
// ---------------------------------------------------------------------------
/**
 * Numeric level for each role. Higher = more permissions.
 * Use hasRole() helper rather than comparing strings directly.
 */
export const ROLE_LEVEL = {
  learner:     1,
  trainer:     2,
  manager:     3,
  org_admin:   4,
  super_admin: 5,
};

/** Maps JWT payload fields to the user shape expected by the UI. */
function mapPayloadToUser(payload) {
  let role = payload.role_type || payload.role || 'learner';

  return {
    id: payload.sub,
    email: payload.email,
    full_name: payload.full_name || payload.name || '',
    role: role,
    role_type: role,
    organization_id: payload.org || payload.organization_id || null,
    session_id: payload.sid || null,
    permissions: payload.permissions || [],
  };
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // ---------------------------------------------------------------------------
  // Restore session from localStorage on mount
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const restoreSession = async () => {
      const accessToken = tokenStorage.getAccessToken();
      const refreshToken = tokenStorage.getRefreshToken();

      if (!accessToken && !refreshToken) {
        setIsLoadingAuth(false);
        return;
      }

      // Handle mock tokens
      if (accessToken === 'mock-super-admin-token' || accessToken === 'mock-org-admin-token' || accessToken === 'mock-manager-token' || accessToken === 'mock-trainer-token' || accessToken === 'mock-learner-token') {
        let email = 'learner@eserve.org.uk';
        let fullName = 'Foster Carer';
        let role = 'learner';

        if (accessToken === 'mock-super-admin-token') {
          email = 'superadmin@eserve.org.uk';
          fullName = 'Super Admin';
          role = 'super_admin';
        } else if (accessToken === 'mock-org-admin-token') {
          email = 'orgadmin@eserve.org.uk';
          fullName = 'Org Admin';
          role = 'org_admin';
        } else if (accessToken === 'mock-manager-token') {
          email = 'manager@eserve.org.uk';
          fullName = 'Team Manager';
          role = 'manager';
        } else if (accessToken === 'mock-trainer-token') {
          email = 'trainer@eserve.org.uk';
          fullName = 'Course Trainer';
          role = 'trainer';
        }

        const mockPayload = { sub: 'mock-id', email, full_name: fullName, role };
        setUser(mapPayloadToUser(mockPayload));
        setIsAuthenticated(true);
        setIsLoadingAuth(false);
        return;
      }

      // Access token still valid — extract user from payload and validate session
      if (accessToken && !isTokenExpired(accessToken)) {
        const payload = decodeJwtPayload(accessToken);
        if (payload) {
          // Validate that the token has a valid session in the backend
          try {
            await apiClient.get('/courses', { params: { limit: 1 } });
            // Token is valid, set user
            setUser(mapPayloadToUser(payload));
            setIsAuthenticated(true);
            setIsLoadingAuth(false);
            return;
          } catch (error) {
            // Token invalid (401/403) - clear and try refresh
            console.log('Token validation failed, attempting refresh...');
          }
        }
      }

      // Access token expired or invalid — try silent refresh
      if (refreshToken) {
        try {
          const result = await authApi.refresh(refreshToken);
          const { access_token, refresh_token: newRefresh } = result.data;
          tokenStorage.setTokens(access_token, newRefresh);
          const payload = decodeJwtPayload(access_token);
          if (payload) {
            setUser(mapPayloadToUser(payload));
            setIsAuthenticated(true);
          }
        } catch {
          // Refresh also failed - clear everything and force re-login
          console.log('🔄 Token refresh failed. Please login again.');
          tokenStorage.clearTokens();
        }
      } else {
        // No refresh token available - clear and force re-login
        tokenStorage.clearTokens();
      }

      setIsLoadingAuth(false);
    };

    restoreSession();
  }, []);

  // ---------------------------------------------------------------------------
  // login — called by Login / Register / Social pages after they get tokens
  // ---------------------------------------------------------------------------
  const login = useCallback((accessToken, refreshToken, userData = null) => {
    tokenStorage.setTokens(accessToken, refreshToken);
    const payload = decodeJwtPayload(accessToken);
    let resolvedUser = null;
    
    if (userData) {
      // Normalize backend API response to match UI expectations
      const role = userData.role_type || userData.role || (payload ? payload.role : 'learner');
      resolvedUser = {
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name || '',
        role: role,
        role_type: role,
        organization_id: userData.organisation_id || userData.organization_id || null,
        session_id: payload ? payload.sid : null,
        permissions: userData.permissions || [],
      };
    } else if (payload) {
      resolvedUser = mapPayloadToUser(payload);
    }

    setUser(resolvedUser);
    setIsAuthenticated(true);
  }, []);

  // ---------------------------------------------------------------------------
  // logout — clears tokens and optionally invalidates refresh token on server
  // ---------------------------------------------------------------------------
  const logout = useCallback(async (redirectToLogin = true) => {
    const refreshToken = tokenStorage.getRefreshToken();
    tokenStorage.clearTokens();
    setUser(null);
    setIsAuthenticated(false);

    if (refreshToken) {
      // Best-effort server revocation — don't block UI on failure
      authApi.logout(refreshToken).catch(() => { });
    }

    if (redirectToLogin) {
      window.location.href = '/login';
    }
  }, []);

  // ---------------------------------------------------------------------------
  // logoutAll — revokes every session for this user
  // ---------------------------------------------------------------------------
  const logoutAll = useCallback(async () => {
    try {
      await authApi.logoutAll();
    } catch {
      // ignore
    }
    tokenStorage.clearTokens();
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  }, []);

  // ---------------------------------------------------------------------------
  // forceRefreshToken — manually refresh the access token
  // ---------------------------------------------------------------------------
  const forceRefreshToken = useCallback(async () => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const result = await authApi.refresh(refreshToken);
      const { access_token, refresh_token: newRefresh } = result.data;
      tokenStorage.setTokens(access_token, newRefresh);
      const payload = decodeJwtPayload(access_token);
      if (payload) {
        setUser(mapPayloadToUser(payload));
      }
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, log out
      await logout();
      return false;
    }
  }, [logout]);

  /**
   * Returns true if the current user's role meets or exceeds `minRole`.
   * Usage: hasRole('manager') — true for manager, org_admin, super_admin.
   */
  const hasRole = (minRole) => {
    if (!user) return false;
    const userLevel = ROLE_LEVEL[user.role] || 0;
    const requiredLevel = ROLE_LEVEL[minRole] || 0;
    return userLevel >= requiredLevel;
  };

  /**
   * Returns true if the current user has a specific resource:action permission.
   * Usage: hasPermission('courses', 'create')
   */
  const hasPermission = (resource, action) => {
    if (!user) return false;
    // super_admin always passes
    if (user.role === 'super_admin') return true;
    return (user.permissions || []).some(
      (p) => (p.resource === resource && (p.action === action || p.action === 'manage')) ||
              (p.resource === 'admin' && p.action === 'manage')
    );
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      // kept for backwards compat with AppLayout / TopBar
      organisationId: user?.organization_id || null,
      organisation: null,
      authError: null,
      isLoadingPublicSettings: false,
      authChecked: !isLoadingAuth,
      login,
      logout,
      logoutAll,
      forceRefreshToken,
      hasRole,
      hasPermission,
      navigateToLogin: () => { window.location.href = '/login'; },
      checkUserAuth: () => { },
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};