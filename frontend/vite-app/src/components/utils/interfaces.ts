import type { Product , Action} from "./types.ts"

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
  user: User | null;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setUser?: React.Dispatch<React.SetStateAction<User | null>> ;
}

interface RefreshResponse {
    access: string;
}

interface EditDataProps {
  user: User | null;
  action: Action;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export type {
    User , ProductPageProps , RefreshResponse , EditDataProps
}
