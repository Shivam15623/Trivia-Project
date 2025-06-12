import CustomMinimalRoot from "@/Layouts/Customer Layouts/CustomMinimalRoot";
import {
  LazyEndGame,
  LazyLoader,
  LazyPlayGamePage,
  LazyWaitingRoom,
} from "@/lazy components";

import RouteGuard from "@/RouteGuard/RouteGuard";
import { Suspense } from "react";
import { RouteObject } from "react-router-dom";

const CustomerMinimalRoutes: RouteObject = {
  path: "/customer",
  element: (
    <Suspense fallback={<LazyLoader />}>
       <RouteGuard requireRole="customer" isPublic={false}>
        <CustomMinimalRoot />
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

export default CustomerMinimalRoutes