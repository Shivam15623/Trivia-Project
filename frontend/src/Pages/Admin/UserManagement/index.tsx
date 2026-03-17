import { useState } from "react";
import { GradientCard } from "@/Pages/Customer/CustomerHome/components/GradientBorderCard";
import { useAllUsersQuery } from "@/services";
import CustomTable from "@/components/CustomTable";
import { UserTableInfo } from "@/interfaces/Userinterface";
import Pagination from "@/components/ui/paggination";
import UserStatsDetails from "./components/UserStatsDetails";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SuspendStatus from "./components/SuspendStatus";
import BannUser from "./components/BannUser";

const UserStatusBadge = ({
  status,
}: {
  status: "active" | "suspended" | "banned" | "deleted";
}) => {
  const colorStyle = {
    active: "bg-[#59FF004D]",
    suspended: "bg-[#FF77004D]",
    banned: "bg-[#FF00004D]",
    deleted: "bg-[#FF00004D]",
  };

  const colorClass = colorStyle[status];

  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={cn(
        "rounded-[100px] px-[18px] py-2 font-inter text-sm font-normal leading-[100%] text-white",
        colorClass,
      )}
    >
      {label}
    </span>
  );
};
const UserManagement = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAllUsersQuery({
    page,
    limit: 10,
  });

  const users = data?.data?.users || [];
  console.log(users)
  const totalPages = data?.data?.totalPages || 1;

  const columns = [
    {
      name: "User",
      cell: (row: UserTableInfo) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={row?.profilePic || ""} />
            <AvatarFallback className="bg-[#7BFDFD] font-outfit text-2xl font-medium leading-[22px] text-[#2884C7]">
              {row?.firstname?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">
              {row.firstname} {row.lastname}
            </span>
            <span className="text-xs text-white/60">{row.email}</span>
          </div>
        </div>
      ),
    },

    {
      name: "Total Games Played",

      cell: (row: UserTableInfo) => (
        <span className="text-center font-inter text-sm font-normal leading-[100%] text-white">
          {row.totalGamesPlayed}
        </span>
      ),
    },
    {
      name: "Win Ratio",
      cell: (row: UserTableInfo) => (
        <div className="flex flex-row items-center gap-2.5">
          <div className="h-2.5 w-[100px] rounded-full bg-white">
            <div
              className="h-2.5 rounded-full bg-[#FE7002] transition-all duration-300"
              style={{
                width: `${row.overallWinRatio * 100}%`,
              }}
            />
          </div>
          <span className="font-inter text-sm font-normal leading-[100%] text-white">
            {Number(row.overallWinRatio * 100).toFixed(0)}%
          </span>
        </div>
      ),
    },
    {
      name: "Status",
      cell: (row: UserTableInfo) => (
        <UserStatusBadge status={row.accountStatus} />
      ),
    },
    {
      name: "Actions",
      cell: (row: UserTableInfo) => (
        <div className="flex flex-row items-center gap-2">
          <UserStatsDetails slug={row.slug} />
          <SuspendStatus
            user={{
              _id: row._id,
              email: row.email,
              firstname: row.firstname,
              lastname: row.lastname,
              profilePic: row.profilePic,
            }}
          />
          <BannUser
            user={{
              _id: row._id,
              email: row.email,
              firstname: row.firstname,
              lastname: row.lastname,
              profilePic: row.profilePic,
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="relative z-10 flex flex-col gap-[30px]">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-2 text-white">
            <h2 className="font-sans text-[36px] font-semibold leading-[100%]">
              User Management
            </h2>
            <h4 className="font-inter text-[18px] font-normal leading-[100%]">
              Manage and monitor all registered user
            </h4>
          </div>
        </div>
        <GradientCard
          padding={3}
          radius={12}
          className="h-full w-full bg-[#FFFFFF1A]"
        >
          <div className="flex flex-col gap-6 p-[34px]">
            {isLoading ? (
              <div className="text-white">Loading...</div>
            ) : (
              <CustomTable columns={columns} data={users} variant="Question" />
            )}
          </div>
        </GradientCard>
        <div className="w-full">
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-0 top-[27.5%] h-[813px] w-[914px] rotate-[150.39deg] rounded-[132px] bg-[linear-gradient(180deg,#72FDFD99_0%,#02184299_100%)] opacity-60 blur-[100px]" />
        <div className="absolute right-0 top-[52%] h-[597px] w-[918px] rotate-[17.68deg] rounded-[40px] bg-[linear-gradient(180deg,#FE852099_0%,#FED55499_100%)] opacity-60 blur-[100px]" />
      </div>
    </>
  );
};

export default UserManagement;
