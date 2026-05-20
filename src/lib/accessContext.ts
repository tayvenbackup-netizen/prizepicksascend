import { createContext, useContext } from 'react';

export type AccessInfo = { isAdmin: boolean };
export const AccessContext = createContext<AccessInfo>({ isAdmin: false });
export const useAccess = () => useContext(AccessContext);
