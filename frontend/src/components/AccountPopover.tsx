import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Gamepad2 } from "lucide-react";

import { useDispatch } from "react-redux";
import { useGetUserProfileQuery, useLogoutMutation } from "@/services";
import { setLoggedOut } from "@/redux/AuthSlice/authSlice";

import { handleApiError } from "@/utills/handleApiError";
import { Link } from "react-router-dom";
import Loader from "./Loader";

const AccountPopover = () => {
  const { data: user,isLoading } = useGetUserProfileQuery();

  const [Logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const onLogout = async () => {
    try {
      const response = await Logout(undefined).unwrap();
      if (response.statuscode === 200) {
        dispatch(setLoggedOut());
      }
    } catch (error) {
      handleApiError(error);
    }
  };
  if(isLoading){
    return<Loader/>
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="w-10 sm:w-11 sm:h-11 2xl:w-18 h-10 2xl:h-18 grid border-2 p-0  border-[#a90000] rounded-full place-content-center"
        >
          <Avatar className="h-full w-full">
            <AvatarImage src={user?.data.profilePic} alt="profile" />
            <AvatarFallback>
              {user?.data.firstname?.[0] || "U"}
              {user?.data.lastname?.[0] || ""}
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="z-[999] p-0  space-y-0 max-w-fit"
      >
        <div className="px-4 py-3 border-b border-[#f3f4f6]">
          <div className="text-[#111827] text-sm font-semibold">
            {user?.data.firstname} {user?.data.lastname}
          </div>
          <div className="text-[#6b7280] mt-0.5 text-xs">
            {user?.data.email}
          </div>
        </div>
        <div className="p-2 space-y-1">
          <Link
            className="block"
            to={`/${user?.data.role}/userProfile/${user?.data.slug}`}
          >
            <Button variant="ghost" className="w-full justify-start">
              <User className="mr-2 h-4 w-4" /> My Profile
            </Button>
          </Link>
          <Link to={`/${user?.data.role}/mygames`} className="block">
            <Button variant="ghost" className="w-full justify-start">
              <Gamepad2 className="mr-2 h-4 w-4" /> My Games
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AccountPopover;
