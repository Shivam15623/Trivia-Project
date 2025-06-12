import { ApiResponse } from "./GenericResponse";

export type CategoryType = "kids" | "special" | "regular" | "event";

export interface Category {
  name: string;
  isPublic: boolean;
  description: string;
  thumbnail: string;
  _id: string; // assuming you're working with MongoDB
  createdAt?:Date
  slug: string;
}
interface HomeCategory {
  name: string;
  thumbnail: string;
}

interface TopCategory {
  categoryId: string;
  name: string;
  count: number;
  
}

interface MonthlyTopUsedCategory {
  categoryId: string;
  name: string;
  count: number;
  thumbnail: string;
}

export interface DashboardCategoryData {
  totalCategories: number;
  totalActiveCategories: number;
  totalInactiveCategories: number;
  topCategories: TopCategory[];
  recentlyAddedCategories: Category[];
  monthlyTopUsedCategories: MonthlyTopUsedCategory[];
  
}
export type DashboardCategoryResponse=ApiResponse<DashboardCategoryData>
export type CategoryHomeResponse = ApiResponse<HomeCategory[]>;
export type CategoryDetailsresponse = ApiResponse<Category>;
export type allCategoryResponse = ApiResponse<Category[]>;
