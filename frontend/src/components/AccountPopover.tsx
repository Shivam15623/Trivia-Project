import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Gamepad2 } from "lucide-react";

import { useDispatch } from "react-redux";
import { useGetUserProfileQuery, useLogoutMutation } from "@/services";
import { setLoggedOut } from "@/redux/AuthSlice/authSlice";

import { handleApiError } from "@/utills/handleApiError";
import { Link } from "react-router-dom";

const AccountPopover = () => {
  const { data: user, isFetching } = useGetUserProfileQuery();
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();

  const onLogout = async () => {
    try {
      const res = await logout(undefined).unwrap();
      if (res.statuscode === 200) {
        dispatch(setLoggedOut());
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  if (isFetching || !user?.data) return null;

  const { firstname, lastname, email, profilePic, role, slug } = user.data;

  return (
    <Popover>
      <div className="relative">
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="w-10 sm:w-11 sm:h-11 2xl:w-18 h-10 2xl:h-18 p-0 border-2 border-[#a90000] rounded-full grid place-content-center cursor-pointer"
          >
            <Avatar className="w-full h-full">
              <AvatarImage src={profilePic} alt="Profile" />
              <AvatarFallback>
                {(firstname?.[0] || "U") + (lastname?.[0] || "")}
              </AvatarFallback>
            </Avatar>
          </Button>
        </PopoverTrigger>
        <PopoverAnchor />
      </div>
      <PopoverContent
        sideOffset={8}
        align="start"
        className="z-[999] p-0 overflow-hidden  border border-gray-200 rounded-lg shadow-lg bg-white w-fit max-w-[90vw]"
      >
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="text-sm font-semibold text-gray-900">
            {firstname} {lastname}
          </div>
          <div className="text-xs text-gray-500 truncate">{email}</div>
        </div>
        <div className="p-2 flex flex-col space-y-1">
          <Link to={`/${role}/userProfile/${slug}`}>
            <Button variant="ghost" className="w-full justify-start">
              <User className="mr-2 h-4 w-4" />
              My Profile
            </Button>
          </Link>
          <Link to={`/${role}/mygames`}>
            <Button variant="ghost" className="w-full justify-start">
              <Gamepad2 className="mr-2 h-4 w-4" />
              My Games
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-auto justify-start text-red-500 hover:text-red-600"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AccountPopover;
