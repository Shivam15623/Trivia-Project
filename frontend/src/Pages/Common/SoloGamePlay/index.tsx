import Loader from "@/components/Loader";
import { selectAuth } from "@/redux/AuthSlice/authSlice";
import { useFetchSessionInfoSoloQuery } from "@/services";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import StartSoloGame from "./components/StartSoloGame";
import PlaySoloGame from "./components/PlaySoloGame";

const SoloGamePlay = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user } = useSelector(selectAuth);
  const userId = user?._id;

  const { data: sessionData, isFetching } = useFetchSessionInfoSoloQuery(
    sessionId!
  );

  if (isFetching) return <Loader />;

  const status = sessionData?.data?.status;
  const gameId = sessionData?.data?.gameId;
  const sessionOwnerId = sessionData?.data?.userId;

  if (!status || !gameId) return <div>Invalid session</div>;

  if (status === "waiting") return <StartSoloGame gameId={gameId} />;
  if (status === "active" && userId === sessionOwnerId) return <PlaySoloGame />;
  if (status === "active" && userId !== sessionOwnerId)
    return <div>Unauthorized</div>;
  if (status === "completed") return <div>Game Ended</div>;

  return null;
};
export default SoloGamePlay;
