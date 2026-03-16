import CustomRoot from "@/Layouts/Customer";
import GameRoot from "@/Layouts/Game";
import PublicRoot from "@/Layouts/Public";
import {
  LazyCategories,
  LazyAdminHome,
  LazyAdminRoot,
  LazyCategoryDetailsPage,

  LazyCreateGame,

  LazyForgotPassword,
  LazyLoader,
  LazyLogin,

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
  LazyJoinGame,
  LazyUserManagement,
} from "@/lazy components";
import Home from "@/Pages/Customer/CustomerHome";
import RouteGuard from "@/RouteGuard";
import { Suspense } from "react";
import { RouteObject } from "react-router-dom";

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
      </RouteGuard>,
    ),
    children: [{ index: true, element: withSuspense(<LazyPublicHome />) }],
  },
  {
    path: "login",
    element: withSuspense(
      <RouteGuard isPublic={true}>
        <LazyLogin />
      </RouteGuard>,
    ),
  },
  {
    path: "signup",
    element: withSuspense(
      <RouteGuard isPublic={true}>
        <LazySignup />
      </RouteGuard>,
    ),
  },
  {
    path: "verifyemail",
    element: withSuspense(
      <RouteGuard isPublic={true}>
        <LazyverifyUserEmail />
      </RouteGuard>,
    ),
  },
  {
    path: "reset-password",
    element: withSuspense(
      <RouteGuard isPublic={true}>
        <LazyForgotPassword />
      </RouteGuard>,
    ),
  },
  {
    path: "reset-request-password",
    element: withSuspense(
      <RouteGuard isPublic={true}>
        <LazyRequestResetPassword />
      </RouteGuard>,
    ),
  },
  {
    path: "/email-verification-sent",
    element: withSuspense(
      <RouteGuard isPublic={true}>
        <LazyEmailVerificationSent />
      </RouteGuard>,
    ),
  },
  {
    path: "/resent-email",
    element: withSuspense(
      <RouteGuard isPublic={true}>
        <LazyApplyEmailVerification />
      </RouteGuard>,
    ),
  },
  {
    path: "/customer",
    element: <CustomRoot />,
    children: [
      { index: true, element: <Home /> },
    
      { path: "CreateGame", element: withSuspense(<LazyCreateGame />) },
      { path: "userProfile/:slug", element: withSuspense(<LazyUserProfile />) },
      { path: "joinGame", element: withSuspense(<LazyJoinGame />) },
    ],
  },

  // ✅ Admin routes
  {
    path: "/admin",
    element: withSuspense(
      <RouteGuard requireRole="admin">
        <LazyAdminRoot />
      </RouteGuard>,
    ),
    children: [
      { index: true, element: withSuspense(<LazyAdminHome />) },
      { path: "categories", element: withSuspense(<LazyCategories />) },
      {
        path: "category/:slug",
        element: withSuspense(<LazyCategoryDetailsPage />),
      },
      { path: "userProfile/:slug", element: withSuspense(<LazyUserProfile />) },
      {
        path: "user-management",
        element: withSuspense(<LazyUserManagement />),
      },
     
      { path: "CreateGame", element: withSuspense(<LazyCreateGame />) },
      { path: "joinGame", element: withSuspense(<LazyJoinGame />) },
    ],
  },
  {
    path: "/game",
    element: withSuspense(<GameRoot />),
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
        path: "SoloGame/:sessionCode",
        element: withSuspense(<LazySoloGamePlay />),
      },
      {
        path: "SoloGameEnd/:sessionCode",
        element: withSuspense(<LazySoloGameEnd />),
      },
    ],
  },
  {
    path: "*",
    element: withSuspense(<LazyNotFound />),
  },
];
