export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  productCount: number;
  image: string;
  showOnHome?: boolean;
};

export type CustomizableProduct = {
  id: string;
  name: string;
  description: string;
  customizationType: string;
  minQty: string;
  printColors: string;
  image: string;
};

export type Rubro = {
  id: string;
  slug: string;
  name: string;
  description: string;
  categorySlugs: string[];
  image: string;
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  categorySlug: string;
  price: number;
  unit: string;
  minQty: number;
  images: string[];
  description: string;
  specs: ProductSpec[];
  tags: string[];
  material?: string;
  features?: string[];
  featured?: boolean;
  inStock: boolean;
};

export type CartItem = {
  productId: string;
  quantity: number;
  note?: string;
};
