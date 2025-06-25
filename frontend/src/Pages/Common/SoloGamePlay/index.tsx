import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Suspense } from "react";

import { selectAuth } from "@/redux/AuthSlice/authSlice";
import { useFetchSessionInfoSoloQuery } from "@/services";

import Loader from "@/components/Loader";
import { LazyPlaySoloGame, LazyStartSoloGame } from "@/lazy components";

const SoloGamePlay = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user } = useSelector(selectAuth);
  const userId = user?._id;

  const { data: sessionData, isLoading } = useFetchSessionInfoSoloQuery(sessionId!);

  if (isLoading) return <Loader />;

  const status = sessionData?.data?.status;
  const gameId = sessionData?.data?.gameId;
  const sessionOwnerId = sessionData?.data?.userId;

  // 💡 Handle invalid session or missing data
  if (!status || !gameId) return <div>Invalid session</div>;

  return (
    <Suspense fallback={<Loader />}>
      {status === "waiting" && <LazyStartSoloGame gameId={gameId} />}
      {status === "active" && userId === sessionOwnerId && <LazyPlaySoloGame />}
      {status === "active" && userId !== sessionOwnerId && <div>Unauthorized Access</div>}
      {status === "completed" && <div>Game Ended</div>}
    </Suspense>
  );
};

export default SoloGamePlay;
