import {
  LazyLoader,
  LazyCustomerRoot,
  LazyCustomerHome,
  LazyMyGames,
  LazyCustomerPlay,
  LazyUserProfile,
  LazySoloGamePlay,
  LazySoloGameEnd,
} from "@/lazy components";

import RouteGuard from "@/RouteGuard/RouteGuard";
import { Suspense } from "react";
import { RouteObject } from "react-router-dom";

const CustomerMainRoutes: RouteObject = {
  path: "/customer",
  element: (
    <Suspense fallback={<LazyLoader />}>
      <RouteGuard requireRole="customer" isPublic={false}>
        <LazyCustomerRoot />
      </RouteGuard>
    </Suspense>
  ),
  children: [
    {
      index: true,
      element: (
        <Suspense fallback={<LazyLoader />}>
          <LazyCustomerHome />
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
      path: "play",
      element: (
        <Suspense fallback={<LazyLoader />}>
          <LazyCustomerPlay />
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

export default CustomerMainRoutes;
