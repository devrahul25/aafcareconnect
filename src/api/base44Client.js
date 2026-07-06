import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

// Guard: sandboxed iframes (app preview) may block `window.localStorage`
// with a SecurityError, which crashes the SDK's createClient. Install an
// in-memory shim before the SDK runs so it keeps working read-only.
(function ensureSafeLocalStorage() {
  try {
    window.localStorage.setItem('__base44_probe__', '1');
    window.localStorage.removeItem('__base44_probe__');
  } catch (e) {
    const mem = new Map();
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: (k) => (mem.has(k) ? mem.get(k) : null),
        setItem: (k, v) => mem.set(k, String(v)),
        removeItem: (k) => { mem.delete(k); },
        clear: () => mem.clear(),
        key: (i) => Array.from(mem.keys())[i] ?? null,
        get length() { return mem.size; },
      },
    });
  }
})();

const { appId, token, functionsVersion, appBaseUrl } = appParams;

//Create a client with authentication required
export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl
});