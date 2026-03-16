import { ApiResponse } from "@/interfaces/GenericResponse";
import { api } from "@/redux/ApiSlice/apiSlice";

interface AnalyticsResponseData {
  totalGames: number;
  gamesToday: number;
  topCategories: [
    {
      categoryId: string;
      name: string;
      count: number;
    },
  ];
  modeUsage: {
    solo: number;
    timed_solo: number;
    team: number;
  };
  totalCategories: number;
  activeCategories: number;
  liveRunningGames: number;
  averageGameDuration: {
    allTime: number; // e.g. 187  → "3m 7s"
    today: number; // e.g. 210  → "3m 30s"
  };
  liveUsers: number;
  activeUsersToday: number;
}
type Analyticsresponse = ApiResponse<AnalyticsResponseData>;
export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    analyticDashboard: builder.query<Analyticsresponse, void>({
      query: () => ({
        url: "/api/v1/dashboard-analytics",
        method: "GET",
      }),
    }),
  }),
});

export const { useAnalyticDashboardQuery } = dashboardApi;
