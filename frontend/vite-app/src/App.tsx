import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import LoginPage from "./components/Login_Page";
import Header from "./components/Header";
import { ProductPage } from "./components/ProductPage";
import SignUpPage from "./components/SignUpPage";
import { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000/api";

type User = {
  username: string;
  id: number;
  email: string;
};

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [access_token, setAccess_token] = useState<string | null>(
    localStorage.getItem("access_token"),
  );
  const [refresh_token, setRefresh_token] = useState<string | null>(
    localStorage.getItem("refresh_token"),
  );
  const location = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!access_token && !refresh_token) return;

      try {
        const token = access_token;
        let response = await fetch(`${API}/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok && refresh_token) {
          const refreshRes = await fetch(`${API}/token/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: refresh_token }),
          });

          if (!refreshRes.ok) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            setUser(null);
            setAccess_token(null);
            setRefresh_token(null);
            return;
          }

          const refreshData = await refreshRes.json();
          const newToken = refreshData.access;
          localStorage.setItem("access_token", newToken);
          setAccess_token(newToken);

          response = await fetch(`${API}/profile/`, {
            headers: { Authorization: `Bearer ${newToken}` },
          });
        }

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
    // eslint-disable-next-line
  }, []);

  if (
    !user &&
    location.pathname !== "/login" &&
    location.pathname !== "/signup"
  ) {
    navigate("/login");
  }

  if (user && location.pathname === "/login") {
    navigate("/products");
  }

  function onLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    setAccess_token(null);
    setRefresh_token(null);
    navigate("/login");
  }

  return (
    <>
      <Header user={user} onLogout={onLogout} />
      <Routes>
        <Route
          path="/login"
          element={
            <LoginPage
              setUser={setUser}
              setAccess={setAccess_token}
              setRefresh={setRefresh_token}
            />
          }
        />
        <Route
          path="/products"
          element={<ProductPage access_token={access_token} />}
        />
        <Route path="/" element={<ProductPage access_token={access_token} />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </>
  );
}

export default function AppWithRouter() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
