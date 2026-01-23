import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

type User = {
  username: string;
  password?: string;
};

type HeaderProps = {
  user?: User | null;
  onLogout?: () => void;
};

enum Action {
  EDIT_USERNAME,
  EDIT_PASSWORD,
  DELETE_ACCOUNT,
  ADD_PRODUCT,
}

function handleActionTitle(action: Action) {
  switch (action) {
    case Action.EDIT_USERNAME:
      return "Change Username";
    case Action.EDIT_PASSWORD:
      return "Change Password";
    case Action.DELETE_ACCOUNT:
      return "Delete Account";
    case Action.ADD_PRODUCT:
      return "Add Product";
    default:
      return "";
  }
}

function handleActionInput(user: User, action: Action) {
  switch (action) {
    case Action.EDIT_USERNAME:
      return (
        <>
          <Label htmlFor="username">Username</Label>
          <Input id="username" name="username" defaultValue={user.username} />
        </>
      );
    case Action.EDIT_PASSWORD:
      return (
        <>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" />
        </>
      );
    case Action.DELETE_ACCOUNT:
      return (
        <>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" />
        </>
      );
    case Action.ADD_PRODUCT:
      return (
        <>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" />

          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" type="number" />

          <Label htmlFor="description">Description</Label>
          <Input id="description" name="description" />
        </>
      );
    default:
      return null;
  }
}

interface EditUserProps {
  user: User | null;
  action: Action;
}

export function ModalHandler({ user, action }: EditUserProps) {
  if (!user) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log("Form submitted:", data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="w-full text-left flex justify-start pl-2 m-0"
          variant="ghost"
        >
          {handleActionTitle(action)}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {action == Action.ADD_PRODUCT ? "Add Product" : "Handle Account"}
          </DialogTitle>
          <DialogDescription>Make changes to your data here.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-3">{handleActionInput(user, action)}</div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const UserAvatar: React.FC<{ user: User }> = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <span>{user.username}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Account</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <ModalHandler user={user} action={Action.EDIT_USERNAME} />
        <ModalHandler user={user} action={Action.EDIT_PASSWORD} />
        <ModalHandler user={user} action={Action.DELETE_ACCOUNT} />

        <DropdownMenuSeparator />

        <ModalHandler user={user} action={Action.ADD_PRODUCT} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const location = useLocation();

  const isLoginRoute = location.pathname === "/login";
  const isSignupRoute = location.pathname === "/signup";
  const isProductsRoute = location.pathname === "/products";

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-muted border-b">
      <h1 className="text-xl font-bold">Product App</h1>
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
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
            )}
            {!isSignupRoute && (
              <Button variant="outline" asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            )}
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
