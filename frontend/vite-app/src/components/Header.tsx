import React from "react";
import { Button } from "../components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from "./ui/dropdown-menu";

type User = {
  name: string;
};

type HeaderProps = {
  user?: User | null;
  onLogin?: () => void;
  onSignup?: () => void;
  onLogout?: () => void;
};



const UserAvatar: React.FC<{ user: User }> = ({ user }) => {
return (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" size="sm" className="flex items-center gap-2">
        <span>{user.name}</span>
        <ChevronDown className="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56">
      <DropdownMenuLabel>Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={() => alert("Change password or name")}
      >
        Change Password / Name
      </DropdownMenuItem>
      <DropdownMenuItem
        className="text-red-600 focus:text-red-700"
        onClick={() => alert("Delete account")}
      >
        Delete Account
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
};

const Header: React.FC<HeaderProps> = ({
  user,
  onLogin,
  onSignup,
  onLogout,
}) => {
  const location = useLocation();

  const isLoginRoute = location.pathname === "/login";
  const isSignupRoute = location.pathname === "/signup";
  const isProductsRoute = location.pathname === "/products";

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-muted border-b">
      <h1 className="text-xl font-bold">
        Product App
      </h1>
      <nav className="flex gap-4">
        {user ? (
          <>
              <Button variant="destructive" onClick={onLogout}>
                Logout
              </Button>
            {!isProductsRoute && (
              <Button variant="outline" asChild>
                <Link to="/products">Products</Link>
              </Button>
            )}
            <UserAvatar user={user} />
          </>
        ) : (
          <>
            {!isLoginRoute && (
              <Button variant="outline" onClick={onLogin}>
                Login
              </Button>
            )}
            {!isSignupRoute && (
              <Button onClick={onSignup}>Sign up</Button>
            )}
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
