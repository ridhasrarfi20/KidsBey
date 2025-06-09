import type { PropsWithChildren } from "react";

import { MobileHeader } from "@/components/mobile-header";
import { Sidebar } from "@/components/sidebar";

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div 
        className="fixed inset-0 z-[-1]" 
        style={{
          backgroundImage: "url('/images/5.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          opacity: 0.15, // Subtle background so content remains readable
        }}
      />
      <MobileHeader />
      <Sidebar className="hidden lg:flex" />
      <main className="min-h-screen w-full pt-[50px] lg:pl-[256px] lg:pt-0 bg-transparent">
        <div className="mx-auto h-full w-full max-w-full sm:max-w-[1056px] pt-4 sm:pt-6 px-2 sm:px-4 md:px-8">
          {children}
        </div>
      </main>
    </>
  );
};

export default MainLayout;
