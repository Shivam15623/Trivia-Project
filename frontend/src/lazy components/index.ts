import { lazy } from "react";
export const LazyLoader = lazy(() => import("../components/Loader"));
export const LazyAdminRoot = lazy(() => import("../Layouts/Admin/AdminRoot"));
export const LazyCustomerRoot = lazy(() => import("../Layouts/Customer"));
export const LazyCustomerHome = lazy(
  () => import("@/Pages/Customer/Customer Home")
);
export const LazyAdminHome = lazy(
  () => import("@/Pages/Admin/Dashboard")
);
export const LazyPublicHome = lazy(() => import("@/Pages/Public/Public Home"));


export const LazySignup = lazy(() => import("@/Pages/Public/Signup"));
export const LazyverifyUserEmail = lazy(
  () => import("@/Pages/Public/VerifyEmail")
);
export const LazyMyGames = lazy(() => import("@/Pages/Common/MyGames"));
export const LazyCreateGame = lazy(
  () => import("@/Pages/Common/CreateGame")
);
export const LazyUserProfile = lazy(
  () => import("@/Pages/Common/UserProfile")
);
export const LazyCategories = lazy(() => import("@/Pages/Admin/Categories"));

export const LazyCategoryDetailsPage = lazy(
  () => import("@/Pages/Admin/CategoryDetails")
);
export const LazyWaitingRoom = lazy(
  () => import("@/Pages/Common/WaitingRoom")
);
export const LazyPlayGamePage = lazy(
  () => import("@/Pages/Common/PlayGame")
);

export const LazyLogin = lazy(() => import("@/Pages/Public/Login"));
export const LazyEndGame = lazy(() => import("@/Pages/Common/EndGame"));

export const LazyRequestResetPassword = lazy(
  () => import("@/Pages/Public/RequestResetPassword")
);
export const LazyForgotPassword = lazy(
  () => import("@/Pages/Public/ForgotPassword")
);
export const LazySoloGamePlay = lazy(
  () => import("@/Pages/Common/SoloGamePlay")
);
export const LazySoloGameEnd = lazy(
  () => import("@/Pages/Common/SoloGameEnd")
);
export const LazyEmailVerificationSent = lazy(
  () => import("@/Pages/Public/EmailVerificationSent")
);
export const LazyApplyEmailVerification = lazy(
  () => import("@/Pages/Public/ApplyEmailVerification")
);
