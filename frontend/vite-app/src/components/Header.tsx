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
// import API from "./utils/globals";
import { authFetch } from "./utils/authFetch";

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

export const Action = {
  EDIT_USERNAME: 'EDIT_USERNAME',
  EDIT_PASSWORD: 'EDIT_PASSWORD',
  DELETE_ACCOUNT: 'DELETE_ACCOUNT',
  ADD_PRODUCT: 'ADD_PRODUCT',
  EDIT_PRODUCT: 'EDIT_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
} as const;

export type Action = typeof Action[keyof typeof Action];

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
    case Action.EDIT_PRODUCT:
      return "Edit";
    case Action.DELETE_PRODUCT:
      return "Delete";
    default:
      return "";
  }
}

function handleActionInput(
  user: User,
  action: Action,
) {
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
    case Action.EDIT_PRODUCT:
      return (
        <>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name"  />

          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" type="number"  />

          <Label htmlFor="description">Description</Label>
          <Input id="description" name="description"  />
        </>
      );
    case Action.DELETE_PRODUCT:
      return <p>Are you sure you want to delete this product?</p>;
    default:
      return null;
  }
}

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  author: User;
  date: string;
};

interface EditDataProps {
  user: User | null;
  action: Action;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export function ModalHandler({
  user,
  action,
  // products,
  setProducts,
  productId = null,
}: EditDataProps & { productId?: number | null }) {
  if (!user) return null;
  const [alert, setAlert] = useState<{
    type: "default" | "destructive";
    title: string;
    description: string;
  } | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (action === Action.ADD_PRODUCT) {
      try {
        // console.log("Form submitted:", data);

        const res = await authFetch(
          "/create-product/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          },
          navigate,
        );

        if (!res.ok) {
          throw new Error("Failed to create product");
        }

        setAlert({
          type: "default",
          title: "Product created successfully",
          description: "Product has been created.",
        });

        const listRes = await authFetch("/list-products/", {}, navigate);

        if (!listRes.ok) {
          navigate("/login");
          return;
        }

        const productsData = await listRes.json();
        setProducts(productsData);
      } catch (e) {
        setAlert({
          type: "destructive",
          title: "Failed to create product",
          description: "Please try again later.",
        });
      }
    }
    if (action == Action.DELETE_PRODUCT){
        try{
          const res = await authFetch(
            `/delete-product/${productId}/`,
            {
              method: "DELETE",
            },
            navigate,
          );

          if (!res.ok) {
            throw new Error("Failed to delete product");
          }

          setAlert({
            type: "default",
            title: "Product deleted successfully",
            description: "Product has been deleted.",
          }); 

          const listRes = await authFetch("/list-products/", {}, navigate);

          if (!listRes.ok) {
            navigate("/login");
            return;
          }
          
          const productsData = await listRes.json();
          setProducts(productsData);
        }
        catch(e){
          setAlert({
            type: "destructive",
            title: "Failed to delete product",
            description: "Please try again later.",
          });
        }
    }
    if(action == Action.EDIT_PRODUCT){
      try{
        const data_filtered : { [key: string]: string | number } = {};

        for(const pair of formData.entries()){
          if(pair[1].toString().trim() !== ""){
            data_filtered[pair[0]] = pair[1] as string;
          }
        }

        if(data_filtered.price){
          data_filtered.price = Number(data_filtered.price);
        }

        console.log(data_filtered);

        const res = await authFetch(
          `/edit-product/${productId}/`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data_filtered),
          },
          navigate,
        );

        if (!res.ok) {
          throw new Error("Failed to edit product");
        }
        
        setAlert({
          type: "default",
          title: "Product edited successfully",
          description: "Product has been edited.",
        });

        const listRes = await authFetch("/list-products/", {}, navigate);
        if (!listRes.ok) {
          navigate("/login");
          return;
        }
        const productsData = await listRes.json();
        setProducts(productsData);

      } catch (e) {
        setAlert({
          type: "destructive",
          title: "Failed to edit product",
          description: "Make sure all fields are filled correctly.",
        });
      }
    }
  }
  //

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className={`text-left flex justify-start  m-0
                    ${action == Action.EDIT_PRODUCT ? "w-fit mt-4 p-[17px]" : "w-full"}
                    ${action == Action.DELETE_PRODUCT ? "w-fit mt-4 p-[17px]" : ""}`}
          variant={`${action == Action.EDIT_PRODUCT ? "secondary" : action == Action.DELETE_PRODUCT ? "destructive" : "ghost"}`}
        >
          {handleActionTitle(action)}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {action == Action.ADD_PRODUCT ||
            action == Action.EDIT_PRODUCT ||
            action == Action.DELETE_PRODUCT
              ? "Handle Product"
              : "Handle Account"}
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

            {action == Action.DELETE_PRODUCT && (
              <Button variant="destructive" type="submit">
                Delete
              </Button>
            )}
            {action != Action.DELETE_PRODUCT && (
              <Button type="submit">Save changes</Button>
            )}
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
              products={products!}
              setProducts={setProducts!}
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
