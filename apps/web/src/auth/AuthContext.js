import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchCurrentActor, login as loginRequest, logout as logoutRequest } from "../api/auth";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
    const [status, setStatus] = useState("loading");
    const [actor, setActor] = useState(null);
    const refresh = useCallback(async () => {
        const currentActor = await fetchCurrentActor();
        setActor(currentActor);
        setStatus(currentActor ? "authenticated" : "unauthenticated");
    }, []);
    useEffect(() => {
        void refresh();
    }, [refresh]);
    const login = useCallback(async (email, password) => {
        const nextActor = await loginRequest(email, password);
        if (!nextActor) {
            throw new Error("Credenciales inválidas. Verifica el email y la contraseña.");
        }
        setActor(nextActor);
        setStatus("authenticated");
        return nextActor;
    }, []);
    const logout = useCallback(async () => {
        await logoutRequest();
        setActor(null);
        setStatus("unauthenticated");
    }, []);
    const value = useMemo(() => ({ status, actor, login, logout, refresh }), [status, actor, login, logout, refresh]);
    return _jsx(AuthContext.Provider, { value: value, children: children });
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de AuthProvider.");
    }
    return context;
}
//# sourceMappingURL=AuthContext.js.map