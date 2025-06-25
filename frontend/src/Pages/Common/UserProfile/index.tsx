import AccountUpdate from "./components/AccountUpdate";
import AccountPassword from "./components/AccountPassword";
import TabsWrapper from "@/components/TabsWrapper";

const UserProfile = () => {
  const tabs = [
    {
      content: <AccountUpdate />,
      label: "User Account",
      value: "account",
    },
    {
      content: <AccountPassword />,
      label: "Password",
      value: "password",
    },
  ];
  return (
    <div className="flex-1 bg-[#fff8f0]  flex items-center justify-center py-10 px-4">
      <div className="max-w-4xl sm:w-2/3  w-full lg:w-1/2   mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-[#e34b4b]">User Profile</h1>
        <TabsWrapper
          tabs={tabs}
          defaultValue="account"
          size="lg"
          variant="userprofile"
        />
      </div>
    </div>
  );
};
export default UserProfile;
