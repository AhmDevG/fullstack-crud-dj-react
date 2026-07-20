import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isAuthUser } from "./isAuth";
import LoadingPage  from "../Loading_Page"

export function UnProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        async function check() {
            const ok = await isAuthUser();
            setAuthenticated(ok);
            setLoading(false);
        }

        check();
    }, []);

    if (loading) {
        return <LoadingPage/>;
    }

    if (authenticated) {
        return <Navigate to="/products" replace/>;
    }
    else{
        return <>{children}</>;
    }

}
