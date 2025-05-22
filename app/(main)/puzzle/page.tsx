'use client';
import React from "react";
import PuzzleGame from "./PuzzleGame";
import Image from "next/image";
import { useState } from "react";

const IMAGES = [
  "1.jpg",
  "2.jpg",
  "3.jpg",
  "4.jpg",
  "5.jpg",
  "6.jpg",
  "7.jpg",
  "9.jpg",
  "10.jpg",
];

const PuzzlePage = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-gray-50">
      <div className="hidden" />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-green-700">Jouer au puzzle</h1>
        {!selectedImage ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {IMAGES.map((img) => (
              <button
                key={img}
                className="rounded-xl overflow-hidden shadow-lg border-4 border-transparent hover:border-green-500 transition"
                onClick={() => setSelectedImage(img)}
              >
                <Image
                  src={`/images/${img}`}
                  alt={img}
                  width={300}
                  height={200}
                  className="object-cover w-full h-48"
                />
              </button>
            ))}
          </div>
        ) : (
          <PuzzleGame imageFile={selectedImage} onRestart={() => setSelectedImage(null)} />
        )}
      </main>
    </div>
  );
};

export default PuzzlePage;
