import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { appParams } from '@/lib/app-params';
import { createAxiosClient } from '@base44/sdk/dist/utils/axios-client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]                         = useState(null);
  const [organisationId, setOrganisationId]     = useState(null);
  const [organisation, setOrganisation]         = useState(null);
  const [isAuthenticated, setIsAuthenticated]   = useState(false);
  const [isLoadingAuth, setIsLoadingAuth]       = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError]               = useState(null);
  const [authChecked, setAuthChecked]           = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => { checkAppState(); }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      setAuthError(null);

      const appClient = createAxiosClient({
        baseURL: `/api/apps/public`,
        headers: { 'X-App-Id': appParams.appId },
        token: appParams.token,
        interceptResponses: true,
      });

      try {
        const publicSettings = await appClient.get(`/prod/public-settings/by-id/${appParams.appId}`);
        setAppPublicSettings(publicSettings);
        if (appParams.token) {
          await checkUserAuth();
        } else {
          setIsLoadingAuth(false);
          setIsAuthenticated(false);
          setAuthChecked(true);
        }
        setIsLoadingPublicSettings(false);
      } catch (appError) {
        const reason = appError?.data?.extra_data?.reason;
        if (appError.status === 403 && reason) {
          setAuthError({ type: reason, message: appError.message });
        } else {
          setAuthError({ type: 'unknown', message: appError.message || 'Failed to load app' });
        }
        setIsLoadingPublicSettings(false);
        setIsLoadingAuth(false);
      }
    } catch (error) {
      setAuthError({ type: 'unknown', message: error.message || 'An unexpected error occurred' });
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
    }
  };

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);

      // ── Resolve organisation_id ──────────────────────────────────────────────
      // Look up the WorkforceMember record that links this user to an org.
      // Falls back to checking if the user IS an organisation owner via their
      // custom 'organisation_id' field set at registration/invite time.
      let orgId = currentUser.organisation_id || null;
      let orgRecord = null;

      if (!orgId) {
        // Try WorkforceMember first (staff accounts)
        try {
          const members = await base44.entities.WorkforceMember.filter({ email: currentUser.email });
          if (members.length > 0) {
            orgId = members[0].organisation_id;
          }
        } catch (_) { /* no workforce record — may be an admin/owner */ }
      }

      if (orgId) {
        // Fetch the full organisation record so pages can display its name etc.
        try {
          orgRecord = await base44.entities.Organisation.get(orgId);
        } catch (_) { /* organisation record not created yet — still set the id */ }
        setOrganisationId(orgId);
        setOrganisation(orgRecord);
      }
      // If orgId is still null the user will see an empty state; pages should
      // handle the case gracefully and prompt admin setup.

      setIsLoadingAuth(false);
      setAuthChecked(true);
    } catch (error) {
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      setAuthChecked(true);
      if (error.status === 401 || error.status === 403) {
        setAuthError({ type: 'auth_required', message: 'Authentication required' });
      }
    }
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setOrganisationId(null);
    setOrganisation(null);
    setIsAuthenticated(false);
    base44.auth.logout(shouldRedirect ? window.location.href : undefined);
  };

  const navigateToLogin = () => base44.auth.redirectToLogin(window.location.href);

  return (
    <AuthContext.Provider value={{
      user,
      organisationId,
      organisation,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      authChecked,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState,
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