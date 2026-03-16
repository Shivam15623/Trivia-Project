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
    <>
      {/* Page */}
      <div className="relative flex-1 overflow-hidden bg-black px-[20px] py-[60px] sm:px-[40px] md:px-[60px] lg:px-[80px] xl:px-[120px]">
        <div className="relative z-10 mx-auto flex w-full max-w-[860px] flex-col gap-8">
          <TabsWrapper
            tabs={tabs}
            defaultValue="account"
          />
        </div>
      </div>

      {/* Background glows — same as JoinGame */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-[109px] top-[133.68px] z-[7] h-[328.07px] w-[504.23px] rotate-[17.68deg] rounded-[40px] bg-orange-sun opacity-60 blur-[65.6px] sm:left-auto sm:right-[83px] sm:top-[195px] sm:h-[604.663px] sm:w-[929.051px]" />
        <div className="absolute -left-[235px] top-[100px] z-[4] h-[378px] w-[425px] rotate-[150.39deg] rounded-[132px] bg-aqua-abyss opacity-60 blur-[65.6px] sm:left-[230px] sm:top-[179px] sm:h-[696.774px] sm:w-[783.48px]" />
      </div>
    </>
  );
};

export default UserProfile;
