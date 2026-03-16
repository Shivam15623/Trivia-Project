import Loader from "@/components/Loader";
import { selectAuth } from "@/redux/AuthSlice/authSlice";
import { useFetchGameSessionInfoQuery } from "@/services";

import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PlayGame from "../components/PlayGame";
import StartGame from "./components/StartGame";

const SoloGame = () => {
  const { sessionCode } = useParams<{ sessionCode: string }>();
  const { user } = useSelector(selectAuth);
  const userId = user?._id;

  const {
    data: sessionData,
    isLoading,

    refetch,
  } = useFetchGameSessionInfoQuery(sessionCode!, {
    skip: !sessionCode,
  });

  // 🔄 Show loader only on initial load
  if (isLoading) return <Loader />;

  if (!sessionData?.data) {
    return (
      <div className="flex flex-1 items-center justify-center bg-black text-white">
        Invalid session
      </div>
    );
  }

  const session = sessionData.data;
  const { status, host } = session;

  return (
    <>
      {status === "waiting" && (
        <StartGame session={session} refetch={refetch} />
      )}

      {status === "active" && userId === host && <PlayGame />}

      {status === "active" && userId !== host && (
        <div className="flex flex-1 items-center justify-center bg-black text-white">
          Unauthorized
        </div>
      )}

      {status === "completed" && (
        <div className="flex flex-1 items-center justify-center bg-black text-white">
          Game Ended
        </div>
      )}
    </>
  );
};

export default SoloGame;
