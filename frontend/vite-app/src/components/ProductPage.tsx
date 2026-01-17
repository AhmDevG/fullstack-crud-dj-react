import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ProductPageProps {
  productId: string;
  productName: string;
  ProductDescription: string;
  ProductPrice: number;
}

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
  productId,
  productName,
  ProductDescription,
  ProductPrice,
}: ProductPageProps) {

  return (
      <Card className="max-w-md mt-8">
        <CardHeader>
          <CardTitle>{productName}</CardTitle>
          <CardDescription>ID: {productId}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-2">{ProductDescription}</p>
          <p className="font-semibold">Price: ${ProductPrice}</p>
        </CardContent>
      </Card>
  );
}

const products = [
  {
    productId: "12345",
    productName: "Sample Product",
    ProductDescription: "This is a sample product description.",
    ProductPrice: 99.99
  },
  {
    productId: "67890",
    productName: "Another Product",
    ProductDescription: "This is another product description.",
    ProductPrice: 149.99
  }
]


export function ProductPage() {
  return (
    <ProductsWrapper>
      {
        products.map((product) => (
          <ProductComponent
            productId={product.productId}
            productName={product.productName}
            ProductDescription={product.ProductDescription}
            ProductPrice={product.ProductPrice}
          />
        ))
      }
    </ProductsWrapper>

  );
}


