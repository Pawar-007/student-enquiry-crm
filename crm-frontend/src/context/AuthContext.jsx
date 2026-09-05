// import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
// import { login as loginApi } from '../api/authApi';
// import { registerUnauthorizedHandler } from '../api/apiClient';

// export const AuthContext = createContext(null);

// const TOKEN_KEY = 'ledger_token';
// const EMAIL_KEY = 'ledger_email';
// const ROLE_KEY = 'ledger_role';

// function readSession() {
//   return {
//     token: localStorage.getItem(TOKEN_KEY),
//     email: localStorage.getItem(EMAIL_KEY),
//     role: localStorage.getItem(ROLE_KEY),
//   };
// }

// export function AuthProvider({ children }) {
//   const [session, setSession] = useState(readSession);
//   const [initializing, setInitializing] = useState(true);

//   useEffect(() => {
//     setInitializing(false);
//   }, []);

//   const logout = useCallback(() => {
//     localStorage.removeItem(TOKEN_KEY);
//     localStorage.removeItem(EMAIL_KEY);
//     localStorage.removeItem(ROLE_KEY);
//     setSession({ token: null, email: null, role: null });
//   }, []);

//   // Global 401/403 handling: any expired/invalid JWT logs the user out.
//   useEffect(() => {
//     registerUnauthorizedHandler(() => {
//       logout();
//     });
//   }, [logout]);

//   const login = useCallback(async (email, password) => {
//     const data = await loginApi({ email, password }); // { token, email, role }
//     localStorage.setItem(TOKEN_KEY, data.token);
//     localStorage.setItem(EMAIL_KEY, data.email);
//     localStorage.setItem(ROLE_KEY, data.role);
//     setSession({ token: data.token, email: data.email, role: data.role });
//     return data;
//   }, []);

//   const value = useMemo(
//     () => ({
//       token: session.token,
//       email: session.email,
//       role: session.role,
//       isAuthenticated: Boolean(session.token),
//       initializing,
//       login,
//       logout,
//     }),
//     [session, initializing, login, logout]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { login as loginApi } from '../api/authApi';
import { registerUnauthorizedHandler } from '../api/apiClient';

export const AuthContext = createContext(null);

const TOKEN_KEY = 'ledger_token';
const EMAIL_KEY = 'ledger_email';
const ROLE_KEY = 'ledger_role';

function readSession() {
  const role = localStorage.getItem(ROLE_KEY);

  return {
    token: localStorage.getItem(TOKEN_KEY),
    email: localStorage.getItem(EMAIL_KEY),
    role: role?.toUpperCase() || null,
  };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    setInitializing(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    localStorage.removeItem(ROLE_KEY);

    setSession({
      token: null,
      email: null,
      role: null,
    });
  }, []);

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      logout();
    });
  }, [logout]);

  const login = useCallback(async (email, password) => {
    const data = await loginApi({
      email,
      password,
    });

    const normalizedRole = data.role?.toUpperCase();

    const sessionData = {
      token: data.token,
      email: data.email,
      role: normalizedRole,
    };

    localStorage.setItem(TOKEN_KEY, sessionData.token);
    localStorage.setItem(EMAIL_KEY, sessionData.email);
    localStorage.setItem(ROLE_KEY, sessionData.role);

    setSession(sessionData);

    return sessionData;
  }, []);

  const value = useMemo(
    () => ({
      token: session.token,
      email: session.email,
      role: session.role,
      isAuthenticated: Boolean(session.token),
      initializing,
      login,
      logout,
    }),
    [session, initializing, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}