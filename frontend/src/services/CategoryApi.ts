import { ApiGeneralResponse } from "@/interfaces/GenericResponse";
import { api } from "../redux/ApiSlice/apiSlice";
import {
  allCategoryResponse,
  CategoryDetailsresponse,
  CategoryHomeResponse,
  DashboardCategoryResponse,
} from "@/interfaces/categoriesInterface";

export const CategoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation<ApiGeneralResponse, FormData>({
      query: (formData) => ({
        url: "/api/v1/category/createCategory",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Category"],
    }),
    fetchCategories: builder.query<allCategoryResponse, void>({
      query: () => ({
        url: "/api/v1/category/FetchCategories",
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
    fetchCategorybyslug: builder.query<CategoryDetailsresponse, string>({
      query: (id) => ({
        url: `/api/v1/category/fetchCategoryDetails/${id}`,
        method: "GET",
      }),
    }),
    updateCategory: builder.mutation<
      ApiGeneralResponse,
      { categoryId: string; updatedData: FormData }
    >({
      query: ({ categoryId, updatedData }) => ({
        url: `/api/v1/category/updateCategory/${categoryId}`,
        method: "PATCH",
        body: updatedData,
      }),
      invalidatesTags: ["Category"],
    }),
    FetchHomeCategories: builder.query<CategoryHomeResponse, void>({
      query: () => ({
        url: "/api/v1/category/fetchCategoriesHome",
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
    PublicToggle: builder.mutation<ApiGeneralResponse, string>({
      query: (categoryId) => ({
        url: `/api/v1/category/publicToggle/${categoryId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Category"],
    }),
    FetchCategoryPublic: builder.query<allCategoryResponse, void>({
      query: () => ({
        url: "/api/v1/category/FetchPublisCategories",
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
    FetchDashboardCategoryData: builder.query<DashboardCategoryResponse, void>({
      query: () => ({
        url: "/api/v1/category/dashboardCategories",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useFetchCategoriesQuery,
  useFetchCategorybyslugQuery,
  useUpdateCategoryMutation,
  useFetchHomeCategoriesQuery,
  usePublicToggleMutation,
  useFetchCategoryPublicQuery,
  useFetchDashboardCategoryDataQuery,
} = CategoryApi;
