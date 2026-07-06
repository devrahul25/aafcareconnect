// @ts-nocheck
const isNode = typeof window === 'undefined';

// Safe localStorage wrapper — browser may block localStorage access
// (e.g. sandboxed iframes / privacy mode), throwing a SecurityError.
// Fall back to an in-memory Map so the app keeps working read-only.
const createMemoryStorage = () => {
	const mem = new Map();
	return {
		getItem: (k) => (mem.has(k) ? mem.get(k) : null),
		setItem: (k, v) => mem.set(k, String(v)),
		removeItem: (k) => mem.delete(k),
		clear: () => mem.clear(),
	};
};

const getSafeStorage = () => {
	if (isNode) return createMemoryStorage();
	try {
		// Probe access — throws SecurityError when blocked
		window.localStorage.setItem('__base44_probe__', '1');
		window.localStorage.removeItem('__base44_probe__');
		return window.localStorage;
	} catch (e) {
		return createMemoryStorage();
	}
};

const storage = getSafeStorage();

const toSnakeCase = (str) => {
	return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

const getAppParamValue = (paramName, { defaultValue = undefined, removeFromUrl = false } = {}) => {
	if (isNode) {
		return defaultValue;
	}
	const storageKey = `base44_${toSnakeCase(paramName)}`;
	const urlParams = new URLSearchParams(window.location.search);
	const searchParam = urlParams.get(paramName);
	if (removeFromUrl) {
		urlParams.delete(paramName);
		const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ""
			}${window.location.hash}`;
		window.history.replaceState({}, document.title, newUrl);
	}
	if (searchParam) {
		storage.setItem(storageKey, searchParam);
		return searchParam;
	}
	if (defaultValue) {
		storage.setItem(storageKey, defaultValue);
		return defaultValue;
	}
	const storedValue = storage.getItem(storageKey);
	if (storedValue) {
		return storedValue;
	}
	return null;
}

const getAppParams = () => {
	if (getAppParamValue("clear_access_token") === 'true') {
		storage.removeItem('base44_access_token');
		storage.removeItem('token');
	}
	return {
		appId: getAppParamValue("app_id", { defaultValue: import.meta.env.VITE_BASE44_APP_ID }),
		token: getAppParamValue("access_token", { removeFromUrl: true }),
		fromUrl: getAppParamValue("from_url", { defaultValue: window.location.href }),
		functionsVersion: getAppParamValue("functions_version", { defaultValue: import.meta.env.VITE_BASE44_FUNCTIONS_VERSION }),
		appBaseUrl: getAppParamValue("app_base_url", { defaultValue: import.meta.env.VITE_BASE44_APP_BASE_URL }),
	}
}


export const appParams = {
	...getAppParams()
}