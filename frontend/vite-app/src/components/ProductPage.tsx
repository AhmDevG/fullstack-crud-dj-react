import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModalHandler, Action } from "./Header.tsx";
import type { Product } from "./Header.tsx";

interface User {
  id: number;
  username: string;
  email: string;
  date_joined: string;
}

interface ProductPageProps {
  id: string;
  name: string;
  description: string;
  price: number;
  author: User;
  date: string;
  user: User;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const API = "http://127.0.0.1:8000/api";

function ProductsWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 bg-dark-800 min-h-[calc(100vh-69)] h-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
        {children}
      </div>
    </div>
  );
}

function ProductComponent({
  id,
  name,
  description,
  price,
  author,
  date,
  user,
  products,
  setProducts,
}: ProductPageProps) {
  return (
    <Card className="max-w-md mt-8">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2">{description}</p>
        <p className="font-semibold">Price: ${price}</p>
        <p className="mb-2">ID: {id}</p>

        <div className="flex flex-col sm:flex-row justify-between">
          {user.id == author.id && (
            <div className="flex flex-col sm:flex-row">
              <ModalHandler
                products={products}
                user={author}
                setProducts={setProducts}
                action={Action.DELETE_PRODUCT}
              />

              <ModalHandler
                products={products}
                user={author}
                setProducts={setProducts}
                action={Action.EDIT_PRODUCT}
              />
            </div>
          )}

          <div className="text-gray-400 ml-auto mt-4 text-right">
            <p>Date: {date.split("T")[0]}</p>
            <p>Author: {author.username}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductPage({
  access_token,
  products,
  setProducts,
  user,
}: {
  access_token: string;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  user: User;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/list-products/`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
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
  }, [access_token, navigate, setProducts]);

  return (
    <ProductsWrapper>
      {products.map((product) => (
        <ProductComponent
          key={product.id}
          id={product.id}
          name={product.name}
          description={product.description}
          price={product.price}
          author={product.author}
          date={product.date}
          user={user}
          products={products}
          setProducts={setProducts}
        />
      ))}
    </ProductsWrapper>
  );
}
