import type { PropsWithChildren } from "react";

const LessonLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white overflow-hidden">
      {/* Logo background overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-0">
        <img
          src="/logo.png"
          alt="Logo background"
          className="w-64 h-64 sm:w-96 sm:h-96 lg:w-[38rem] lg:h-[38rem] opacity-10 select-none"
          style={{ objectFit: 'contain' }}
        />
      </div>
      <div className="relative flex-1 flex flex-col items-center w-full max-w-full sm:max-w-2xl md:max-w-3xl mx-auto px-2 sm:px-4 md:px-6 py-3 sm:py-6 md:py-8 z-10">{children}</div>
    </div>
  );
};

export default LessonLayout;
