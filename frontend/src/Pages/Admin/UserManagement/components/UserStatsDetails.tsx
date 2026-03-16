import { DialogWrapper } from "@/components/DialogWrapper";
import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { useLazyUserStatsQuery } from "@/services/userApi"; // adjust path
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { cn } from "@/lib/utils";

dayjs.extend(relativeTime);
interface UserStatsDetailsProps {
  slug: string;
}

const UserStatusBadge = ({
  status,
}: {
  status: "active" | "suspended" | "banned" | "deleted";
}) => {
  const colorStyle = {
    active: "bg-[#3AA600D4]",
    suspended: "bg-[#FF7700D4]",
    banned: "bg-[#FF0000D4]",
    deleted: "bg-[#8B0000D4]",
  };

  const colorClass = colorStyle[status];

  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={cn(
        "w-fit rounded-[100px] px-[18px] py-2 font-inter text-sm font-normal leading-[100%] text-white",
        colorClass,
      )}
    >
      {label}
    </span>
  );
};
const UserStatsDetails: React.FC<UserStatsDetailsProps> = ({ slug }) => {
  const [trigger, { data, isLoading, isError }] = useLazyUserStatsQuery();
  const [hasOpened, setHasOpened] = useState(false);

  const handleOpen = () => {
    if (!hasOpened) {
      trigger({ slug }); // fetch only once on first open
      setHasOpened(true);
    }
  };

  const renderStats = () => {
    if (isLoading) return <p>Loading...</p>;
    if (isError || !data?.data) return <p>Error loading user stats.</p>;

    const stats = data.data;
    console.log(stats);

    return (
      <div className="flex flex-col gap-3.5">
        <div className="flex flex-row items-center gap-2">
          <Avatar className="h-[60px] w-[60px]">
            <AvatarImage src={stats?.profilePic || ""} />
            <AvatarFallback className="bg-[#7BFDFD] font-outfit text-2xl font-medium leading-[22px] text-[#2884C7]">
              {stats?.firstname?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2 text-white">
            <div className="flex flex-col gap-0.5 font-outfit font-normal">
              <p className="text-lg leading-[100%]">
                {stats.firstname} {stats.lastname}
              </p>
              <p className="text-sm">{stats.email}</p>
            </div>
            <UserStatusBadge status={stats.accountStatus} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-[20px] bg-[#FFFFFF33] px-[18px] py-[15px] font-outfit font-normal text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)]">
            <p className="text-sm">Total Game Played</p>
            <p className="text-xl font-semibold"> {stats.totalGamesPlayed}</p>
          </div>
          <div className="flex flex-col gap-2 rounded-[20px] bg-[#FFFFFF33] px-[18px] py-[15px] font-outfit font-normal text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)]">
            <p className="text-sm">Win Ratio</p>
            <p className="text-xl font-semibold">
              {Number(stats.overallWinRatio * 100).toFixed(2)}%
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-[20px] bg-[#FFFFFF33] px-[18px] py-[15px] font-outfit font-normal text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)]">
            <p className="text-sm">Join Date</p>
            <p className="text-xl font-semibold">
              {dayjs(stats.joinDate).format("YYYY-DD-MM")}
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-[20px] bg-[#FFFFFF33] px-[18px] py-[15px] font-outfit font-normal text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)]">
            <p className="text-sm">Last Active</p>
            <p className="text-xl font-semibold">
              {dayjs(stats.lastPlayedAt).fromNow()}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3.5 text-white">
          <p className="font-outfit text-lg font-normal">Options</p>

          {/* Team Mode */}
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-row justify-between">
              <span className="font-outfit text-xs font-normal">Team Mode</span>
              <span className="font-outfit text-xs font-normal">
                {stats.modes.team?.gamesPlayed ?? 0}
              </span>
            </div>

            <div className="h-2 w-full rounded-full bg-[#FFFFFF99]">
              <div
                className="h-2 rounded-full bg-[#2884C7] transition-all duration-300"
                style={{
                  width: `${
                    stats.modes.team?.gamesPlayed
                      ? (stats.modes.team.wins / stats.modes.team.gamesPlayed) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Solo Mode */}
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-row justify-between">
              <span className="font-outfit text-xs font-normal">Solo Mode</span>
              <span className="font-outfit text-xs font-normal">
                {stats.modes.solo?.gamesPlayed ?? 0}
              </span>
            </div>

            <div className="h-2 w-full rounded-full bg-[#FFFFFF99]">
              <div
                className="h-2 rounded-full bg-[#2884C7] transition-all duration-300"
                style={{
                  width: `${
                    stats.modes.solo?.gamesPlayed
                      ? (stats.modes.solo.wins / stats.modes.solo.gamesPlayed) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Timed Mode */}
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-row justify-between">
              <span className="font-outfit text-xs font-normal">
                Timed Mode
              </span>
              <span className="font-outfit text-xs font-normal">
                {stats.modes.timed_solo?.gamesPlayed ?? 0}
              </span>
            </div>

            <div className="h-2 w-full rounded-full bg-[#FFFFFF99]">
              <div
                className="h-2 rounded-full bg-[#2884C7] transition-all duration-300"
                style={{
                  width: `${
                    stats.modes.timed_solo?.gamesPlayed
                      ? (stats.modes.timed_solo.wins /
                          stats.modes.timed_solo.gamesPlayed) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DialogWrapper
      type="info"
      title="User Details"
      trigger={
        <Icon icon="mage:eye" className="h-6 w-6 cursor-pointer text-white" />
      }
      size="3xl"
      onOpenChange={handleOpen} // lazy fetch happens here
    >
      {renderStats()}
    </DialogWrapper>
  );
};

export default UserStatsDetails;
