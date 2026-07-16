import type { NavigateFunction } from "react-router-dom";
import API from "./globals";
import type { RefreshResponse } from "./interfaces";

let isLoggedOut = false;
let refreshPromise: Promise<string | null> | null = null;

export const authFetch = async (
    endpoint: string,
    options: RequestInit = {},
    navigate: NavigateFunction
) => {
    if (isLoggedOut) {
        return new Response(null, { status: 401 });
    }

    let access = localStorage.getItem("access_token");
    const refresh = localStorage.getItem("refresh_token");

    const makeRequest = (token: string | null) => {
        const headers = new Headers(options.headers);

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        if (
            options.body &&
            !(options.body instanceof FormData) &&
            !headers.has("Content-Type")
        ) {
            headers.set("Content-Type", "application/json");
        }

        return fetch(`${API}${endpoint}`, {
            ...options,
            headers,
        });
    };

    const logout = () => {
        if (isLoggedOut) return;

        isLoggedOut = true;
        localStorage.clear();

        if(window.location.pathname !== "/login") {
            navigate("/login" , {replace: true});
        }
    };

    const refreshAccessToken = async (): Promise<string | null> => {
        if (!refresh) return null;

        const refreshRes = await fetch(`${API}/token/refresh/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh }),
        });

        if (!refreshRes.ok) {
            return null;
        }

        const data: RefreshResponse = await refreshRes.json();

        if (!data.access) {
            return null;
        }

        localStorage.setItem("access_token", data.access);
        isLoggedOut = false;

        return data.access;
    };

    let response = await makeRequest(access);

    if (response.status !== 401) {
        return response;
    }

    if (!refresh) {
        logout();
        return response;
    }

    
    if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
        });
    }

    
    access = await refreshPromise;

    if (!access) {
        logout();
        return response;
    }

    
    return makeRequest(access);
};
