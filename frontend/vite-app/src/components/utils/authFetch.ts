import API from "./globals";

export const authFetch = async (endpoint, options = {}, navigate) => {
  let access = localStorage.getItem("access_token");
  const refresh = localStorage.getItem("refresh_token");

  let response = await fetch(`${API}${endpoint}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${access}`,
    },
  });

  if (response.status === 401 && refresh) {
    const refreshRes = await fetch(`${API}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!refreshRes.ok) {
      localStorage.clear();
      if (navigate) navigate("/login");
      return response;
    }

    const data = await refreshRes.json();
    access = data.access;

    localStorage.setItem("access_token", access);

    // retry request
    response = await fetch(`${API}${endpoint}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${access}`,
      },
    });
  }

  return response;
};
