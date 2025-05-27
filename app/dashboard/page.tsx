"use client";
import React from "react";
import { Card, CardBody } from "@heroui/react";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0E17] text-[#FCEAFF]">
      <Card className="bg-[#1F1B2E] border border-[#A786DF] rounded-2xl shadow-[0_0_30px_#FF6EC7] p-10 max-w-xl mx-auto text-center">
        <CardBody>
          <h1 className="text-5xl md:text-6xl font-[cursive] text-[#FF6EC7] animate-pulse drop-shadow-[0_0_5px_#FF6EC7]">
            Coming Soon...
          </h1>
          <p className="mt-6 text-[#C3B1E1] text-lg font-light tracking-wide">
            Your futuristic dashboard is on its way 🚀
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default Dashboard;
