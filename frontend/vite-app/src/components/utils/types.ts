import type {User} from "./interfaces.ts"
import {Action} from "./consts.ts"

type Action = typeof Action[keyof typeof Action];


type HeaderProps = {
  user?: User | null;
  setUser?: React.Dispatch<React.SetStateAction<User | null>>;
  onLogout?: () => void;
  products?: Product[];
  setProducts?: React.Dispatch<React.SetStateAction<Product[]>>;
};


type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  author: User;
  date: string;
};

export type { Action , HeaderProps , Product }
