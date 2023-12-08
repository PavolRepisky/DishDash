import React, { createContext, useContext } from "react";
import { useLocalStorage } from "../../core/hooks/useLocalStorage";
import { useLogin } from "../hooks/useLogin";
import { useLogout } from "../hooks/useLogout";
import { useUserInfo } from "../hooks/useUserInfo";
import { UserInfo } from "../types/userInfo";

interface AuthContextInterface {
  hasRole: (roles?: string[]) => {};
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
  userInfo?: UserInfo;
}

export const AuthContext = createContext({} as AuthContextInterface);

type AuthProviderProps = {
  children?: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authKey, setAuthKey] = useLocalStorage<string>("authKey", "");
  const { isLoggingIn, login } = useLogin();
  const { isLoggingOut, logout } = useLogout();
  const { data: userInfo } = useUserInfo(authKey);

  const hasRole = (roles?: string[]) => {
    if (!roles || roles.length === 0) {
      return true;
    }
    if (!userInfo) {
      return false;
    }
    return roles.includes(userInfo.role);
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const { token } = await login({ email, password });
      setAuthKey(token);
      return token;
    } catch (err: any) {
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      const data = logout();
      setAuthKey("");
      return data;
    } catch (err: any) {
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        hasRole,
        isLoggingIn,
        isLoggingOut,
        login: handleLogin,
        logout: handleLogout,
        userInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
