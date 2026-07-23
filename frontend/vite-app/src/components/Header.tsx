import React, { useState } from "react";
import type {Dispatch , SetStateAction} from "react";
import { Link, useLocation, type NavigateFunction } from "react-router-dom";
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
import { authFetch } from "./utils/authFetch";
import type { User, EditDataProps, PasswordResponse } from "./utils/interfaces.ts"
import { Action } from "./utils/consts.ts"
import type { Action as ActionType, HeaderProps , UserAvatarProps , AlertState, Product}  from "./utils/types.ts"



function handleActionTitle(action: ActionType) {
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
    action: ActionType,
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
            return  (
                <>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" />

                    <Label htmlFor="price">Price</Label>
                    <Input id="price" name="price" type="number" />

                    <Label htmlFor="description">Description</Label>
                    <Input id="description" name="description" />
                </>
            );
        case Action.DELETE_PRODUCT:
            return <p>Are you sure you want to delete this product?</p>;
        default:
            return null;
    }
}

async function edit_username(
    navigate: NavigateFunction,
    _data: Record<string, FormDataEntryValue>,
    setAlert: Dispatch<SetStateAction<AlertState | null>>,
    _setProducts: Dispatch<SetStateAction<Product[]>>,
    _setUser: Dispatch<SetStateAction<User | null>>,
    _productId: number | null
){
    try {
        if (!String(_data.username).trim()) {
            throw new Error("Username cannot be empty");
        }
        const res = await authFetch(`/update-username/`, {
            method: "PATCH",
            body: JSON.stringify({ username: _data.username }),
        }, navigate);

        if (!res.ok) {
            throw new Error("Failed to update username");
        }

        setAlert({
            type: "default",
            title: "Username updated successfully",
            description: "Username has been updated.",
        });
        const listRes = await authFetch("/list-products/", {}, navigate);

        if (!listRes.ok) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            navigate("/login", { replace: true });
            return;
        }

        _setProducts(await listRes.json());

        _setUser((prev: User | null) => prev ? { ...prev, username: _data.username as string } : prev);
    }
    catch (e) {
        setAlert({
            type: "destructive",
            title: "Failed to update username",
            description: "Please try again later.",
        });
    }
}
async function edit_password(
    navigate: NavigateFunction,
    _data: Record<string, FormDataEntryValue>,
    setAlert: Dispatch<SetStateAction<AlertState | null>>,
    _setProducts: Dispatch<SetStateAction<Product[]>>,
    _setUser: Dispatch<SetStateAction<User | null>>,
    _productId: number | null
){
    try{
        if (!String(_data.password).trim()) {
            throw new Error("Password cannot be empty");
        }
        const res = await authFetch(`/update-password/`, {
            method: "PATCH",
            body: JSON.stringify({ password: _data.password }),
        }, navigate);

        if (!res.ok) {
            throw new Error("Failed to update password");
        }

        setAlert({
            type: "default",
            title: "Password updated successfully",
            description: "Password has been updated.",
        });

        const responseData : PasswordResponse = await res.json();

        const access_token  = responseData.access;
        const refresh_token = responseData.refresh;

        localStorage.setItem("access_token" , access_token);
        localStorage.setItem("refresh_token" , refresh_token);
    }
    catch(e) {
        setAlert({
            type: "destructive",
            title: "Failed to update password",
            description: "Please try again later.",
        });
    }
}
async function delete_account(
    navigate: NavigateFunction,
    _data: Record<string, FormDataEntryValue>,
    setAlert: Dispatch<SetStateAction<AlertState | null>>,
    _setProducts: Dispatch<SetStateAction<Product[]>>,
    _setUser: Dispatch<SetStateAction<User | null>>,
    _productId: number | null
){
    try{
        if (!String(_data.password).trim()) {
            throw new Error("Password cannot be empty");
        }
        let res = await authFetch(`/check-password/`, {
            method: "POST",
            body: JSON.stringify({ password: _data.password }),
        }, navigate);


        if (!res.ok) {
            throw new Error("Failed to update password");
        }

        const resData = await res.json();

        if(!resData.valid){
            throw new Error("Wrong password");
        }


        res = await authFetch("/delete-account/" , {
            method : "DELETE" ,
            body : JSON.stringify({refresh : localStorage.getItem("refresh_token")}),
        } , navigate) ;

        setAlert({
            type: "default",
            title: "deleted successfully",
            description: "account deleted successfully",
        });

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.reload();
    }
    catch(e) {
        setAlert({
            type: "destructive",
            title: "Wrong password or you are not authenticated",
            description: "Please try again later.",
        });
    }
}

async function add_product(
    navigate: NavigateFunction,
    _data: Record<string, FormDataEntryValue>,
    setAlert: Dispatch<SetStateAction<AlertState | null>>,
    _setProducts: Dispatch<SetStateAction<Product[]>>,
    _setUser: Dispatch<SetStateAction<User | null>>,
    _productId: number | null
){
    try {
        const res = await authFetch(
            "/create-product/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(_data),
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
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            navigate("/login", { replace: true });
            return;
        }

        const productsData = await listRes.json();
        _setProducts(productsData);
    } catch (e) {
        setAlert({
            type: "destructive",
            title: "Failed to create product",
            description: "Please try again later.",
        });
    }
}
async function edit_product(
    navigate: NavigateFunction,
    _data: Record<string, FormDataEntryValue>,
    setAlert: Dispatch<SetStateAction<AlertState | null>>,
    _setProducts: Dispatch<SetStateAction<Product[]>>,
    _setUser: Dispatch<SetStateAction<User | null>>,
    _productId: number | null
){
    try {
        const data_filtered = Object.fromEntries(
            Object.entries(_data).filter(
                ([, value]) => value.toString().trim() !== ""
            )
        ) as Record<string, string | number>;

        if (data_filtered.price) {
            data_filtered.price = Number(data_filtered.price);
        }

        const res = await authFetch(
            `/edit-product/${_productId}/`,
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
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            navigate("/login", { replace: true });
            return;
        }
        const productsData = await listRes.json();
        _setProducts(productsData);

    } catch (e) {
        setAlert({
            type: "destructive",
            title: "Failed to edit product",
            description: "Make sure all fields are filled correctly.",
        });
    }

}
async function delete_product(
    navigate: NavigateFunction,
    _data: Record<string, FormDataEntryValue>,
    setAlert: Dispatch<SetStateAction<AlertState | null>>,
    _setProducts: Dispatch<SetStateAction<Product[]>>,
    _setUser: Dispatch<SetStateAction<User | null>>,
    _productId: number | null
){
    try {
        const res = await authFetch(
            `/delete-product/${_productId}/`,
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
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            navigate("/login", { replace: true });
            return;
        }

        const productsData = await listRes.json();
        _setProducts(productsData);
    }
    catch (e) {
        setAlert({
            type: "destructive",
            title: "Failed to delete product",
            description: "Please try again later.",
        });
    }
}



const actions   = {
    [Action.EDIT_USERNAME ]: edit_username ,  
    [Action.EDIT_PASSWORD ]: edit_password ,
    [Action.DELETE_ACCOUNT] : delete_account  ,

    [Action.ADD_PRODUCT]  : add_product  ,
    [Action.EDIT_PRODUCT]   : edit_product   ,
    [Action.DELETE_PRODUCT]   : delete_product   ,
}  


export function ModalHandler({
    user,
    action,
    setUser,
    setProducts,
    productId = null,
}: EditDataProps & { productId?: number | null, setUser: React.Dispatch<React.SetStateAction<User | null>> }) {
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
        const data : {[k: string]: FormDataEntryValue}  = Object.fromEntries(formData.entries());


        const handler : Function  =  actions[action];
        if (handler) {
            handler(navigate , data , setAlert , setProducts , setUser  , productId);
        }
    }


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

            <DialogContent className="sm:max-w-[425px] [&>button]:hidden"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
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
                            <Button variant="outline" onClick={(_) => setAlert(null)}>Cancel</Button>
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

const UserAvatar: React.FC<UserAvatarProps> = ({ user, products, setProducts, setUser }) => {
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
                    setUser={setUser}
                />
                <ModalHandler
                    user={user}
                    action={Action.EDIT_PASSWORD}
                    products={products}
                    setProducts={setProducts}
                    setUser={setUser}
                />
                <ModalHandler
                    user={user}
                    action={Action.DELETE_ACCOUNT}
                    products={products}
                    setProducts={setProducts}
                    setUser={setUser}
                />

                <DropdownMenuSeparator />

                <ModalHandler
                    user={user}
                    action={Action.ADD_PRODUCT}
                    products={products}
                    setProducts={setProducts}
                    setUser={setUser}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const Header: React.FC<HeaderProps> = ({
    user,
    setUser,
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
                            setUser={setUser!}
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
