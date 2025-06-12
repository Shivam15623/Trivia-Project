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

import logError from "@/utills/logError";

const AccountPopover = () => {
  const { data: user } = useGetUserProfileQuery();

  const [Logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const onLogout = async () => {
    try {
      const response = await Logout(undefined).unwrap();
      if (response.statuscode === 200) {
        dispatch(setLoggedOut());
      }
    } catch (error) {
      logError(error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="p-0 block w-6 sm:w-8 lg:w-10 xl:w-[60px] h-6 sm:h-8 lg:h-10 xl:h-[60px]  rounded-full"
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

      <PopoverContent align="end" className="w-48 z-53 p-2 space-y-1">
        <div className="px-2 text-sm text-muted-foreground">
          {user?.data.firstname} {user?.data.lastname}
        </div>

        <a href={`/${user?.data.role}/userProfile/${user?.data.slug}`}>
          <Button variant="ghost" className="w-full justify-start">
            <User className="mr-2 h-4 w-4" /> My Profile
          </Button>
        </a>

        <a href={`/${user?.data.role}/mygames`}>
          <Button variant="ghost" className="w-full justify-start">
            <Gamepad2 className="mr-2 h-4 w-4" /> My Games
          </Button>
        </a>

        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default AccountPopover;
