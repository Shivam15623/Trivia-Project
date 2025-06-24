import { useFetchSessionInfoSoloQuery } from "@/services";

import { useSelector } from "react-redux";

import { useParams } from "react-router-dom";
import { selectAuth } from "@/redux/AuthSlice/authSlice";
import Loader from "@/components/Loader";
import { Suspense } from "react";
import { LazyPlaySoloGame, LazyStartSoloGame } from "@/lazy components";
const SoloGamePlay = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user } = useSelector(selectAuth);
  const userId = user?._id;
  const { data: Sessiondata, isLoading } = useFetchSessionInfoSoloQuery(
    sessionId!
  );

  if (isLoading) return <Loader />;

  if (Sessiondata?.data.status === "waiting") {
    return (
      <Suspense fallback={<Loader />}>
        <LazyStartSoloGame gameId={Sessiondata.data.gameId} />
      </Suspense>
    );
  }

  if (
    Sessiondata?.data.status === "active" &&
    userId === Sessiondata.data.userId
  ) {
    return (
      <Suspense fallback={<Loader />}>
        <LazyPlaySoloGame />
      </Suspense>
    );
  }

  if (
    Sessiondata?.data.status === "active" &&
    userId !== Sessiondata.data.userId
  ) {
    return <div>UnAuthorized Access</div>;
  }

  if (Sessiondata?.data.status === "completed") {
    return <div>Game Ended</div>;
  }

  return null;
};
export default SoloGamePlay;
