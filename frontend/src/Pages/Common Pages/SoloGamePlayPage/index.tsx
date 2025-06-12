import PlaySoloGame from "@/Pages/Common Pages/SoloGamePlayPage/components/PlaySoloGame";
import StartSoloGame from "@/Pages/Common Pages/SoloGamePlayPage/components/StartSoloGame";
import { useFetchSessionInfoSoloQuery } from "@/services";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

import { useParams } from "react-router-dom";

const SoloGamePlay = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const userId = useSelector((state: RootState) => state.auth.user?._id);
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
