import API from "./globals";

export async function isAuthUser(): Promise<boolean> {
    let access = localStorage.getItem("access_token");
    const refresh = localStorage.getItem("refresh_token");

    if (!refresh) {
        return false;
    }

    async function checkProfile(token: string) {
        return fetch(`${API}/profile/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    
    if (access) {
        const res = await checkProfile(access);

        if (res.ok) {
            return true;
        }
    }

    
    try {
        const refreshRes = await fetch(`${API}/token/refresh/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                refresh,
            }),
        });

        if (!refreshRes.ok) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            return false;
        }

        const data = await refreshRes.json();

        access = data.access;
        localStorage.setItem("access_token", access);

        
        const profileRes = await checkProfile(access);

        if (!profileRes.ok) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            return false;
        }

        return true;
    } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return false;
    }
}
