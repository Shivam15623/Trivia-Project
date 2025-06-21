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
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
    fetchCategories: builder.query<allCategoryResponse, void>({
      query: () => ({
        url: "/api/v1/category/FetchCategories",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((cat) => ({
                type: "Category" as const,
                id: cat._id,
              })),
              { type: "Category", id: "LIST" },
            ]
          : [{ type: "Category", id: "LIST" }],
    }),

    fetchCategorybyslug: builder.query<CategoryDetailsresponse, string>({
      query: (id) => ({
        url: `/api/v1/category/fetchCategoryDetails/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Category", id }],
    }),

    updateCategory: builder.mutation<
      ApiGeneralResponse,
      { categoryId: string; updatedData: FormData }
    >({
      query: ({ categoryId, updatedData }) => ({
        url: `/api/v1/category/updateCategory/${encodeURIComponent(
          categoryId
        )}`,
        method: "PATCH",
        body: updatedData,
      }),
      invalidatesTags: (_result, _error, { categoryId }) => [
        { type: "Category", id: categoryId },
        { type: "Category", id: "LIST" },
      ],
    }),
    DeleteCategory: builder.mutation<ApiGeneralResponse, string>({
      query: (categoryId) => ({
        url: `/api/v1/category/Delete/${encodeURIComponent(categoryId)}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, categoryId) => [
        { type: "Category", id: categoryId },
        { type: "Category", id: "LIST" },
      ],
    }),
    FetchHomeCategories: builder.query<CategoryHomeResponse, void>({
      query: () => ({
        url: "/api/v1/category/fetchCategoriesHome",
        method: "GET",
      }),
      providesTags: [{ type: "Category", id: "LIST" }],
    }),
    PublicToggle: builder.mutation<ApiGeneralResponse, string>({
      query: (categoryId) => ({
        url: `/api/v1/category/publicToggle/${encodeURIComponent(categoryId)}`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, categoryId) => [
        { type: "Category", id: categoryId },
        { type: "Category", id: "LIST" },
      ],
    }),
    FetchCategoryPublic: builder.query<allCategoryResponse, void>({
      query: () => ({
        url: "/api/v1/category/FetchPublisCategories",
        method: "GET",
      }),
      providesTags: [{ type: "Category", id: "LIST" }],
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
  useDeleteCategoryMutation,
} = CategoryApi;
