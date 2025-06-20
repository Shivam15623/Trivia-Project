
import { useFetchSessionInfoSoloQuery } from "@/services";

import { useSelector } from "react-redux";

import { useParams } from "react-router-dom";
import { selectAuth } from "@/redux/AuthSlice/authSlice";
import PlaySoloGame from "./components/PlaySoloGame";
import StartSoloGame from "./components/StartSoloGame";

const SoloGamePlay = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const {user} = useSelector(selectAuth);
  const userId=user?._id
  const { data: Sessiondata } = useFetchSessionInfoSoloQuery(sessionId!);

  if (Sessiondata?.data.status === "waiting") {
    return <StartSoloGame gameId={Sessiondata.data.gameId} />;
  }
  if (
    Sessiondata?.data.status === "active" &&
    userId === Sessiondata.data.userId
  ) {
    return (
      <>
        <PlaySoloGame />
      </>
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
};

export default SoloGamePlay;
