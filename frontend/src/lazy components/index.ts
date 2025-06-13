import { lazy } from "react";
export const LazyLoader = lazy(() => import("../CustomComponent/Loader"));
export const LazyAdminRoot = lazy(
  () => import("../Layouts/Admin Layouts/AdminRoot")
);
export const LazyCustomerRoot = lazy(
  () => import("../Layouts/Customer Layouts")
);
export const LazyCustomerHome = lazy(
  () => import("@/Pages/Customer pages/Customer Home")
);
export const LazyAdminHome = lazy(
  () => import("@/Pages/Admin Pages/AdminHome")
);
export const LazyPublicHome = lazy(
  () => import("@/Pages/Public Pages/Public Home")
);
export const LazyPlay = lazy(() => import("@/Pages/Public Pages/Play"));

export const LazySignup = lazy(() => import("@/Pages/Public Pages/Signup"));
export const LazyverifyUserEmail = lazy(
  () => import("@/Pages/Public Pages/VerifyEmail")
);
export const LazyMyGames = lazy(() => import("@/Pages/Common Pages/MyGamesPage"));
export const LazyCustomerPlay = lazy(
  () => import("@/Pages/Customer pages/CustomerPlay")
);
export const LazyUserProfile = lazy(() => import("@/Pages/Common Pages/UserProfilePage"));
export const LazyCategories = lazy(
  () => import("@/Pages/Admin Pages/Categories")
);

export const LazyCategoryDetailsPage = lazy(
  () => import("@/Pages/Admin Pages/Category Details")
);
export const LazyWaitingRoom = lazy(() => import("@/Pages/Common Pages/WaitingRoomPage"));
export const LazyPlayGamePage = lazy(() => import("@/Pages/Common Pages/PlayGamePage"));

export const LazyLogin = lazy(() => import("@/Pages/Public Pages/Login"));
export const LazyEndGame = lazy(() => import("@/Pages/Common Pages/EndGamePage"));

export const LazyRequestResetPassword = lazy(
  () => import("@/Pages/Public Pages/RequestResetPassword")
);
export const LazyForgotPassword = lazy(
  () => import("@/Pages/Public Pages/ForgotPassword")
);
export const LazySoloGamePlay = lazy(() => import("@/Pages/Common Pages/SoloGamePlayPage"));
export const LazySoloGameEnd = lazy(() => import("@/Pages/Common Pages/SoloGameEndPage"));
