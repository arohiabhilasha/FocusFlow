
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f2f2f7] flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-2xl md:my-8 md:rounded-[3rem] md:border-[8px] md:border-black overflow-hidden flex flex-col">
        {/* Device Notch Simulation (optional for desktop view) */}
        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-2xl z-50"></div>
        
        {/* Status Bar Space */}
        <div className="h-10 w-full flex items-end justify-between px-8 py-2 md:mt-4">
          <span className="text-sm font-semibold">9:41</span>
          <div className="flex gap-1.5 items-center">
            <div className="w-4 h-4 rounded-full border-2 border-current"></div>
            <div className="w-4 h-4 rounded-full border-2 border-current"></div>
            <div className="w-6 h-3 rounded-sm border-2 border-current relative">
               <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-0.5 h-1 bg-current"></div>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto no-scrollbar pb-24 px-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
