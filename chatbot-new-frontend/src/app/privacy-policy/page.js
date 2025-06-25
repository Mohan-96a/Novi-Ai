// pages/privacy-policy.js

import React from 'react';
import PrivacyPolicy from '@/components/PrivacyPolicy';

const Privacy_Policy = () => {
  return (
    <div suppressHydrationWarning className="font-[family-name:var(--font-garamond)] relative bg-gray-100 w-full h-full overflow-scroll">
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-0 lg:left-1/4 w-[300px] lg:w-[600px] h-[600px] bg-pink-200 rounded-full blur-[120px] opacity-50"></div>
              <div className="absolute bottom-[20px] right-[20px] w-[600px] h-[600px] bg-pink-300 rounded-full blur-[120px] opacity-50"></div>
              <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-orange-300 rounded-full blur-[100px] opacity-60"></div>
              <div className="absolute top-[30px] left-[20px] w-[300px] lg:w-[450px] h-[450px] bg-red-300 rounded-full blur-[140px] opacity-50"></div>
            </div>
            <div className="z-10 p-4 lg:p-10 flex flex-col justify-center items-center">
              <PrivacyPolicy/>
            </div>
          </div>
  );
};

export default Privacy_Policy;