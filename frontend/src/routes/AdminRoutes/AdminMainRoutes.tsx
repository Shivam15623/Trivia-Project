import {
  LazyLoader,
  LazyAdminRoot,
  LazyAdminHome,
  LazyCategoryDetailsPage,
  LazyUserProfile,
  LazyMyGames,
  LazyCustomerPlay,
  LazySoloGamePlay,
  LazySoloGameEnd,
  LazyCategories,
} from "@/lazy components";

import RouteGuard from "@/RouteGuard/RouteGuard";
import { Suspense } from "react";
import { RouteObject } from "react-router-dom";

const AdminMainRoutes: RouteObject = {
  path: "/admin",
  element: (
    <Suspense fallback={<LazyLoader />}>
      <RouteGuard requireRole="admin" isPublic={false}>
        <LazyAdminRoot />
      </RouteGuard>
    </Suspense>
  ),
  children: [
    {
      index: true,
      element: (
        <Suspense fallback={<LazyLoader />}>
          <LazyAdminHome />
        </Suspense>
      ),
    },
    {
      path: "categories",
      element: (
        <Suspense fallback={<LazyLoader />}>
          <LazyCategories />
        </Suspense>
      ),
    },

    {
      path: "category/:slug",
      element: (
        <Suspense fallback={<LazyLoader />}>
          <LazyCategoryDetailsPage />
        </Suspense>
      ),
    },
    {
      path: "userProfile",
      element: (
        <Suspense fallback={<LazyLoader />}>
          <LazyUserProfile />
        </Suspense>
      ),
    },

    {
      path: "mygames",
      element: (
        <Suspense fallback={<LazyLoader />}>
          <LazyMyGames />
        </Suspense>
      ),
    },

    {
      path: "CreateGame",
      element: (
        <Suspense fallback={<LazyLoader />}>
          <LazyCustomerPlay />
        </Suspense>
      ),
    },
    {
      path: "SoloGame/:sessionId",
      element: (
        <Suspense fallback={<LazyLoader />}>
          <LazySoloGamePlay />
        </Suspense>
      ),
    },
    {
      path: "SoloGameEnd/:sessionId",
      element: (
        <Suspense fallback={<LazyLoader />}>
          <LazySoloGameEnd />
        </Suspense>
      ),
    },
  ],
};
export default AdminMainRoutes;
