export type Category = string;

export interface DocumentItem {
  id: string;
  title: string;
  category: Category;
  createdAt: string; // Storing as ISO string for easier serialization
  file?: File;
}
