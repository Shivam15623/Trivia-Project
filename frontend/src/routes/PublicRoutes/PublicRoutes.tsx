import PublicRoot from "@/Layouts/Public Layouts/PublicRoot";
import {
  LazyForgotPassword,
  LazyLoader,
  LazyLogin,
  LazyPlay,
  LazyPublicHome,
  LazyRequestResetPassword,
  LazySignup,
  LazyverifyUserEmail,
} from "@/lazy components";


import RouteGuard from "@/RouteGuard/RouteGuard";
import { Suspense } from "react";
import { RouteObject } from "react-router-dom";

const PublicRoutes: RouteObject = {
  path: "/",
  element: (
    <Suspense fallback={<LazyLoader />}>
     <RouteGuard isPublic={true}>
        <PublicRoot />
      </RouteGuard>
    </Suspense>
  ),
  children: [
    {
      index: true,
      element: (
        <Suspense fallback={<LazyLoader />}>
          <LazyPublicHome />
        </Suspense>
      ),
    },
    {
      path: "play",
      element: (
        <Suspense fallback={<LazyLoader />}>
          <LazyPlay />
        </Suspense>
      ),
    },
  ],
};

export const PublicMinimalRoutes: RouteObject[] = [
  {
    path: "login",
    element: (
      <Suspense fallback={<LazyLoader />}>
        <RouteGuard isPublic={true}>
          <LazyLogin />
        </RouteGuard>
      </Suspense>
    ),
  },
  {
    path: "Signup",
    element: (
      <Suspense fallback={<LazyLoader />}>
         <RouteGuard isPublic={true}>
          <LazySignup />
         </RouteGuard>
      </Suspense>
    ),
  },
  {
    path: "verifyemail",
    element: (
      <Suspense fallback={<LazyLoader />}>
         <RouteGuard isPublic={true}>
          <LazyverifyUserEmail />
         </RouteGuard>
      </Suspense>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <Suspense fallback={<LazyLoader />}>
         <RouteGuard isPublic={true}>
          <LazyForgotPassword />
         </RouteGuard>
      </Suspense>
    ),
  },
  {
    path: "/reset-request-password",
    element: (
      <Suspense fallback={<LazyLoader />}>
         <RouteGuard isPublic={true}>
          <LazyRequestResetPassword />
         </RouteGuard>
      </Suspense>
    ),
  },
];
export default PublicRoutes;
