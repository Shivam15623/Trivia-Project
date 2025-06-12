import { Outlet, RouteObject } from "react-router-dom";
import {
    LazyEndGame,
    LazyLoader,
    LazyPlayGamePage,
    LazyWaitingRoom,
  } from "@/lazy components";

import { Suspense } from "react";
import RouteGuard from "@/RouteGuard/RouteGuard";
const AdminMiniMalRoutes:RouteObject={
    path: "/admin",
    element: (
      <Suspense fallback={<LazyLoader />}>
        <RouteGuard requireRole="admin" isPublic={false}>
          <Outlet/>
        </RouteGuard>
      </Suspense>
    ),
    children: [
      {
        path: "PlayGameSession/:sessionCode",
        element: (
          <Suspense fallback={<LazyLoader />}>
            <LazyPlayGamePage />
          </Suspense>
        ),
      },
      {
        path: "Waitingroom/:sessionCode",
        element: (
          <Suspense fallback={<LazyLoader />}>
            <LazyWaitingRoom />
          </Suspense>
        ),
      },
      {
        path: "endgame/:sessionCode",
        element: (
          <Suspense fallback={<LazyLoader />}>
            <LazyEndGame />
          </Suspense>
        ),
      },
    ],
  };
  export default AdminMiniMalRoutes