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
import LoadingPage from "./components/Loading_Page";
import API from "./components/utils/globals";
import { authFetch } from "./components/utils/authFetch";
import type {User} from "./components/utils/interfaces.ts"
import type { Product } from "./components/utils/types.ts";
import {ProtectedRoute} from "./components/utils/ProtectedRoute.tsx";
import { UnProtectedRoute } from "./components/utils/unProtectedRoute.tsx";

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();
  const access_token = localStorage.getItem("access_token");
  const refresh_token = localStorage.getItem("refresh_token");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (loading) return;

    if (
      !user &&
      location.pathname !== "/login" &&
      location.pathname !== "/signup"
    ) {
      navigate("/login" , {replace: true});
    } else if (user && location.pathname === "/login") {
      navigate("/products");
    }
  }, [user, location.pathname, loading]);

  useEffect(() => {
      if(location.pathname == "/login" || location.pathname == "/signup" || !access_token){
          setLoading(false);
          return;
      }

      console.log("Fetch Profile.")
      const fetchProfile = async () => {
          try {
              const res: Response = await authFetch("/profile/", {}, navigate);
              if (res.ok) {
                  const data = await res.json();
                  setUser(data);
              }
          } finally {
              setLoading(false);
          }
      };

      fetchProfile();
  }, [location.pathname , access_token]);

  async function onLogout() {
      try{
        await fetch(`${API}/logout/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refresh_token }),
        });
      }
     finally {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        navigate("/login" , {replace : true});
     }
  }

  return loading ? (
    <LoadingPage user={user} onLogout={onLogout} />
  ) : (
    <>
      <Header
        user={user}
        setUser = {setUser}
        onLogout={onLogout}
        products={products}
        setProducts={setProducts}
      />
      <Routes>
        <Route
          path="/login"
          element={
              <UnProtectedRoute>
                  <LoginPage />
              </UnProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
              <ProtectedRoute>
                    <ProductPage
                      products={products}
                      setProducts={setProducts}
                      user={user}
                      setUser = {setUser}
                    />
              </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
              <ProtectedRoute>
                <ProductPage
                  products={products}
                  setProducts={setProducts}
                  setUser = {setUser}
                />
              </ProtectedRoute>
          }
        />
        <Route path="/signup" element={
              <UnProtectedRoute>
                <SignUpPage /> 
              </UnProtectedRoute>
        } 
        />
      </Routes>
    </>);
}

export default function AppWithRouter() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
