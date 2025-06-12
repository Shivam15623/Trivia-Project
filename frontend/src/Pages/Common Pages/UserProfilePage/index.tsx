import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import AccountUpdate from "./components/AccountUpdate";
import AccountPassword from "./components/AccountPassword";


const UserProfile = () => {
  return (
    <div className="min-h-screen bg-[#fff6f0] flex items-center justify-center py-10 px-4">
      <Card className="w-full max-w-3xl border-orange-300 shadow-xl rounded-xl">
        <CardHeader className="text-center text-2xl font-bold text-[#e34b4b]">
          My Account
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="w-full bg-orange-100 p-1">
              <TabsTrigger
                value="account"
                className="w-1/2 font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#fcbf49] data-[state=active]:to-[#f29e4e] data-[state=active]:text-white transition-all"
              >
                User Details
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="w-1/2 font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#fcbf49] data-[state=active]:to-[#f29e4e] data-[state=active]:text-white transition-all"
              >
                Password
              </TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="mt-6">
              <AccountUpdate />
            </TabsContent>
            <TabsContent value="password" className="mt-6">
              <AccountPassword />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
