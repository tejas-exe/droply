import React from "react";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const { userId } = await auth();
  const user = await currentUser();
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0E17] text-[#FCEAFF]">
      <div className="bg-[#1F1B2E] border border-[#A786DF] rounded-2xl shadow-[0_0_30px_#FF6EC7] p-10 max-w-xl mx-auto text-center">
        <div>
          <h1 className="text-5xl md:text-6xl font-[cursive] text-[#FF6EC7] animate-pulse drop-shadow-[0_0_5px_#FF6EC7]">
            Upload And Share
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
