// ---------------------------------------------------------------------------
// Firebase client helpers
// Uses the Firebase REST API — no npm package required.
// Google sign-in uses the firebase npm package (popup requires the SDK).
// ---------------------------------------------------------------------------

const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const FIREBASE_AUTH_DOMAIN = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;

if (!FIREBASE_API_KEY) {
  console.warn('[firebase.js] VITE_FIREBASE_API_KEY is not set. Auth will not work.');
}

// ---------------------------------------------------------------------------
// Email / Password sign-in via Firebase REST API
// ---------------------------------------------------------------------------
/**
 * Signs in a user with email and password using the Firebase Identity Toolkit.
 * @returns {Promise<string>} Firebase ID Token
 */
export async function firebaseSignIn(email, password) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorCode = data.error?.message || 'UNKNOWN_ERROR';
    // Map Firebase error codes to user-friendly messages
    const messages = {
      EMAIL_NOT_FOUND: 'Invalid email or password.',
      INVALID_PASSWORD: 'Invalid email or password.',
      INVALID_EMAIL: 'Invalid email address.',
      USER_DISABLED: 'This account has been disabled.',
      TOO_MANY_ATTEMPTS_TRY_LATER: 'Too many failed attempts. Please try again later.',
      INVALID_LOGIN_CREDENTIALS: 'Invalid email or password.',
    };
    throw new Error(messages[errorCode] || 'Sign-in failed. Please try again.');
  }

  return data.idToken;
}

// ---------------------------------------------------------------------------
// Google sign-in via Firebase SDK (popup flow)
// Lazy-loads the firebase package only when needed.
// ---------------------------------------------------------------------------
/**
 * Opens a Google sign-in popup and returns a Firebase ID Token.
 * @returns {Promise<string>} Firebase ID Token
 */
export async function firebaseSignInWithGoogle() {
  const { initializeApp, getApps } = await import('firebase/app');
  const { getAuth, signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');

  // Initialise once
  const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
  };

  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }

  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user.getIdToken();
}
