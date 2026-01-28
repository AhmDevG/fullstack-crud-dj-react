import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ProductPageProps {
  id: string;
  name: string;
  description: string;
  price: number;
  author: { username: string };
  date: string;
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

        <p className="text-gray-400 ml-auto mt-4 text-right">
          Date: {date.split("T")[0]}
        </p>
        <p className="text-gray-400 ml-auto text-right">
          Author: {author.username}
        </p>
      </CardContent>
    </Card>
  );
}

export function ProductPage({
  access_token,
  products,
  setProducts,
}: {
  access_token: string;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
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
  }, []);

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
        />
      ))}
    </ProductsWrapper>
  );
}
