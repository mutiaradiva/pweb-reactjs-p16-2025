export type Book = {
  id: string;
  title: string;
  writer: string;
  publisher?: string;
  publication_year?: number;
  price: number;
  stock_quantity: number;
  genre_id?: string;
  publish_date?: string;
};

export type Genre = {
  id: string;
  name: string;
};

export type TransactionItem = {
  book_id: string;
  book_title?: string;
  title?: string;
  quantity: number;
  price: number;
  subtotal_price: number;
};

export interface OrderItem {
  id: string;
  book_id: string;
  quantity: number;
  created_at?: string;
  updated_at?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  order_items: OrderItem[];
}

export type TransactionStatistics = {
  total_transactions: number;
  total_revenue: number;
  total_books_sold: number;
  average_transaction_value: number;
};