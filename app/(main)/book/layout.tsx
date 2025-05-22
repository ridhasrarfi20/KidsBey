import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KidsBey - Book',
  description: 'Read about the Médina of Tunis',
};

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F5F5F5]">
      <header className="w-full bg-white shadow-md py-3 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <h1 className="text-[#C76C4E] text-2xl md:text-3xl font-bold text-center">
            📚 À la découverte de la Médina de Tunis
          </h1>
        </div>
      </header>
      <div className="flex-1 w-full max-w-4xl px-4 pb-8">
        {children}
      </div>
    </div>
  );
}
