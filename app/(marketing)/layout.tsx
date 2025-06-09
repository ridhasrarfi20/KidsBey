import type { PropsWithChildren } from "react";

import { Footer } from "./footer";
import { Header } from "./header";

const MarketingLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 flex-col items-center justify-center w-full max-w-3xl px-2 sm:px-6 mx-auto">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default MarketingLayout;
