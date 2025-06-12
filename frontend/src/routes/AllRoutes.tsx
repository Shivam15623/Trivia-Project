import PublicRoot from "@/Layouts/Public Layouts/PublicRoot";
import {
  LazyCategories,
  LazyAdminHome,
  LazyAdminRoot,
  LazyCategoryDetailsPage,
  LazyCustomerHome,
  LazyCustomerPlay,
  LazyCustomerRoot,
  LazyForgotPassword,
  LazyLoader,
  LazyLogin,
  LazyMyGames,
  LazyPlay,
  LazyPublicHome,
  LazyRequestResetPassword,
  LazySignup,
  LazySoloGameEnd,
  LazySoloGamePlay,
  LazyUserProfile,
  LazyverifyUserEmail,
  LazyPlayGamePage,
  LazyWaitingRoom,
  LazyEndGame,
} from "@/lazy components";
import RouteGuard from "@/RouteGuard/RouteGuard";
import { Suspense } from "react";
import { Outlet, RouteObject } from "react-router-dom";

// 🔐 Suspense Wrapper
const withSuspense = (Component: React.ReactElement) => (
  <Suspense fallback={<LazyLoader />}>{Component}</Suspense>
);
export const AllRoutes: RouteObject[] = [
  {
    path: "/",
    element: withSuspense(
      <RouteGuard isPublic={true}>
        <PublicRoot />
      </RouteGuard>
    ),
    children: [
      { index: true, element: withSuspense(<LazyPublicHome />) },
      { path: "play", element: withSuspense(<LazyPlay />) },
    ],
  },
  {
    path: "login",
    element: withSuspense(
      <RouteGuard isPublic={true}>
        <LazyLogin />
      </RouteGuard>
    ),
  },
  {
    path: "signup",
    element: withSuspense(
      <RouteGuard isPublic={true}>
        <LazySignup />
      </RouteGuard>
    ),
  },
  {
    path: "verifyemail",
    element: withSuspense(
      <RouteGuard isPublic={true}>
        <LazyverifyUserEmail />
      </RouteGuard>
    ),
  },
  {
    path: "reset-password",
    element: withSuspense(
      <RouteGuard isPublic={true}>
        <LazyForgotPassword />
      </RouteGuard>
    ),
  },
  {
    path: "reset-request-password",
    element: withSuspense(
      <RouteGuard isPublic={true}>
        <LazyRequestResetPassword />
      </RouteGuard>
    ),
  },
  {
    path: "/customer",
    element: withSuspense(
      <RouteGuard requireRole="customer">
        <LazyCustomerRoot />
      </RouteGuard>
    ),
    children: [
      { index: true, element: withSuspense(<LazyCustomerHome />) },
      { path: "mygames", element: withSuspense(<LazyMyGames />) },
      { path: "play", element: withSuspense(<LazyCustomerPlay />) },
      { path: "userProfile/:slug", element: withSuspense(<LazyUserProfile />) },
    ],
  },

  // ✅ Admin routes
  {
    path: "/admin",
    element: withSuspense(
      <RouteGuard requireRole="admin">
        <LazyAdminRoot />
      </RouteGuard>
    ),
    children: [
      { index: true, element: withSuspense(<LazyAdminHome />) },
      { path: "categories", element: withSuspense(<LazyCategories />) },
      {
        path: "category/:slug",
        element: withSuspense(<LazyCategoryDetailsPage />),
      },
      { path: "userProfile/:slug", element: withSuspense(<LazyUserProfile />) },
      { path: "mygames", element: withSuspense(<LazyMyGames />) },
      { path: "CreateGame", element: withSuspense(<LazyCustomerPlay />) },
    ],
  },
  {
    path: "/game",
    element: withSuspense(
      <RouteGuard requireAnyRole={["admin", "customer"]}>
        <Outlet />
      </RouteGuard>
    ),
    children: [
      {
        path: "PlayGameSession/:sessionCode",
        element: withSuspense(<LazyPlayGamePage />),
      },
      {
        path: "Waitingroom/:sessionCode",
        element: withSuspense(<LazyWaitingRoom />),
      },
      {
        path: "endgame/:sessionCode",
        element: withSuspense(<LazyEndGame />),
      },
      {
        path: "SoloGame/:sessionId",
        element: withSuspense(<LazySoloGamePlay />),
      },
      {
        path: "SoloGameEnd/:sessionId",
        element: withSuspense(<LazySoloGameEnd />),
      },
    ],
  },
];
