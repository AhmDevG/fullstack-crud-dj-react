import React, { useState } from "react";
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
} from "./ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type User = {
  username: string;
  password?: string;
};

type HeaderProps = {
  user?: User | null;
  onLogout?: () => void;
  products?: Product[];
  setProducts?: React.Dispatch<React.SetStateAction<Product[]>>;
};

enum Action {
  EDIT_USERNAME,
  EDIT_PASSWORD,
  DELETE_ACCOUNT,
  ADD_PRODUCT,
}

const API = "http://127.0.0.1:8000/api";

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
          <Label htmlFor="username">User Name</Label>
          <Input
            id="username"
            name="username"
            defaultValue={user.username}
            required
          />
        </>
      );
    case Action.EDIT_PASSWORD:
      return (
        <>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
        </>
      );
    case Action.DELETE_ACCOUNT:
      return (
        <>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
        </>
      );
    case Action.ADD_PRODUCT:
      return (
        <>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />

          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" type="number" required />

          <Label htmlFor="description">Description</Label>
          <Input id="description" name="description" required />
        </>
      );
    default:
      return null;
  }
}

interface Product {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
  };
}

interface EditUserProps {
  user: User | null;
  action: Action;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export function ModalHandler({
  user,
  action,
  products,
  setProducts,
}: EditUserProps) {
  if (!user) return null;
  const [alert, setAlert] = useState<{
    type: "default" | "destructive";
    title: string;
    description: string;
  } | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (action == Action.ADD_PRODUCT) {
      console.log("Form submitted:", data);

      fetch(`${API}/create-product/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to create product");
          } else {
            return response.json();
          }
        })
        .then((_) => {
          setAlert({
            type: "default",
            title: "Product created successfully",
            description: "Product has been created.",
          });

          fetch(`${API}/list-products/`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          })
            .then((response) => {
              if (!response.ok) {
                navigate("/login");
                return;
              }
              return response.json();
            })
            .then((data) => {
              setProducts(data);
            });
        })
        .catch((error) => {
          setAlert({
            type: "destructive",
            title: "Failed to create product",
            description: "Please try again later.",
          });
        });
    }
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
          {alert && (
            <Alert variant={alert.type} className="mb-4">
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription>{alert.description}</AlertDescription>
            </Alert>
          )}
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

const UserAvatar: React.FC<{
  user: User;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}> = ({ user, products, setProducts }) => {
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

        <ModalHandler
          user={user}
          action={Action.EDIT_USERNAME}
          products={products}
          setProducts={setProducts}
        />
        <ModalHandler
          user={user}
          action={Action.EDIT_PASSWORD}
          products={products}
          setProducts={setProducts}
        />
        <ModalHandler
          user={user}
          action={Action.DELETE_ACCOUNT}
          products={products}
          setProducts={setProducts}
        />

        <DropdownMenuSeparator />

        <ModalHandler
          user={user}
          action={Action.ADD_PRODUCT}
          products={products}
          setProducts={setProducts}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  products,
  setProducts,
}) => {
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
            <UserAvatar
              user={user}
              products={products}
              setProducts={setProducts}
            />
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
