import PublicRoot from "@/Layouts/Public";
import {
  LazyCategories,
  LazyAdminHome,
  LazyAdminRoot,
  LazyCategoryDetailsPage,
  LazyCustomerHome,
  LazyCreateGame,
  LazyCustomerRoot,
  LazyForgotPassword,
  LazyLoader,
  LazyLogin,
  LazyMyGames,
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
  LazyEmailVerificationSent,
  LazyApplyEmailVerification,
  LazyNotFound,
} from "@/lazy components";
import RouteGuard from "@/RouteGuard";
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
    children: [{ index: true, element: withSuspense(<LazyPublicHome />) }],
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
    path: "/email-verification-sent",
    element: withSuspense(
      <RouteGuard isPublic={true}>
        <LazyEmailVerificationSent />
      </RouteGuard>
    ),
  },
  {
    path: "/resent-email",
    element: withSuspense(
      <RouteGuard isPublic={true}>
        <LazyApplyEmailVerification />
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
      { path: "CreateGame", element: withSuspense(<LazyCreateGame />) },
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
      { path: "CreateGame", element: withSuspense(<LazyCreateGame />) },
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
  {
    path: "*",
    element: withSuspense(<LazyNotFound />),
  },
];
