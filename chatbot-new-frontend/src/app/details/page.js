"use client";
import React, { Suspense } from "react";
import { SelectBot } from "@/components/SelectBot";
import { useSearchParams } from "next/navigation";

// Create a separate component to handle the search parameters
function FilteredBotList({ color }) {
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter');

  return <SelectBot color={color} initialFilter={filter} />;
}

const MainComponent = () => {
  return (
    <div suppressHydrationWarning className="font-[family-name:var(--font-garamond)] relative bg-gray-100 w-full h-screen overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-pink-200 rounded-full blur-[120px] opacity-50"></div>
        <div className="absolute bottom-[20px] right-[20px] w-[600px] h-[600px] bg-pink-300 rounded-full blur-[120px] opacity-50"></div>
        <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-orange-300 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute top-[30px] left-[20px] w-[450px] h-[450px] bg-red-300 rounded-full blur-[140px] opacity-50"></div>
      </div>
      <div className="relative z-10 flex flex-col justify-center items-center h-full">
        <Suspense fallback={<div>Loading filter...</div>}>
          <FilteredBotList color="#1B1B1B" />
        </Suspense>
        {/* <RainbowButton >Slelct</RainbowButton> */}
      </div>
    </div>
  );
};

export default MainComponent;