export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  reviewsNumber: number;
  rating: number;
  stockInCount: number;
  category: string;
  brand: string;
  reviews: IProductReview[];
}
export interface IProductReview {
  rating: number;
  createdAt: string;
  comment: string;
  user: {
    id: string;
    name: string;
  };
}

export type IProductResponse = {
  productsData: IProduct[];
  currentPageNumber: number;
  pagesNumber: number | null;
};

export interface IShortenedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  stockInCount: number;
  quantity: number;
}
