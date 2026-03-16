import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { LogOut, User } from "lucide-react";

import { useDispatch } from "react-redux";
import { useGetUserProfileQuery, useLogoutMutation } from "@/services";
import { setLoggedOut } from "@/redux/AuthSlice/authSlice";

import { handleApiError } from "@/utills/handleApiError";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

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

  const { firstname, lastname, email, role, slug } = user.data;

  return (
    <Popover>
      <div className="relative">
        <PopoverTrigger asChild>
          <Icon icon={"mage:user-fill"} className="h-6 w-6 text-[#ED9B5E]" />
        </PopoverTrigger>
        <PopoverAnchor />
      </div>
      <PopoverContent
        sideOffset={8}
        align="start"
        className="z-[999] w-fit max-w-[90vw] overflow-hidden rounded-lg border border-[#ff6e0026] bg-[#0d0d0df2] p-0 shadow-xl shadow-orange-500/10 backdrop-blur-md"
      >
        <div className="border-b border-[#ff6e001a] px-4 py-3">
          <div className="text-sm font-semibold text-white">
            {firstname} {lastname}
          </div>
          <div className="truncate text-xs text-muted-foreground">{email}</div>
        </div>
        <div className="flex flex-col space-y-1 p-2">
          <Link to={`/${role}/userProfile/${slug}`}>
            <Button
              variant="ghost"
              className="w-full justify-start text-[#ff6e00] outline-none ring-0 hover:bg-[#ff6e001a] hover:text-[#ff6e00]"
            >
              <User className="mr-2 h-4 w-4" />
              My Profile
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-auto justify-start text-destructive hover:bg-[#ef43431a] hover:text-destructive"
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
