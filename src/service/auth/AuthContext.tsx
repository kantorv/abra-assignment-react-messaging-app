import React, { useState, useEffect,createContext } from "react";
import { useInterpret } from '@xstate/react';
import { authMachine, AuthMachineActorType } from "./authMachine";

import { InterpreterFrom } from "xstate";



interface AuthProviderProps {
  children: React.ReactNode
}

type AuthContextType = {
  authService: AuthMachineActorType
}





export const AuthContext = createContext<AuthContextType>({  authService: {} as  InterpreterFrom<typeof authMachine>});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const authService = useInterpret(
    authMachine, { devTools: true }
  );

  return (
    <AuthContext.Provider value={{  authService }}> 
      { children }
    </AuthContext.Provider>
  );
};