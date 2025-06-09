'use client';
import React from "react";
import PuzzleGame from "./PuzzleGame";
import Image from "next/image";
import { useState } from "react";

interface ImageDetails {
  src: string;
  width: number;
  height: number;
}

const IMAGES: ImageDetails[] = [
  { src: "1.jpg", width: 612, height: 413 },
  { src: "2.jpg", width: 410, height: 612 },
  { src: "3.jpg", width: 612, height: 408 },
  { src: "4.jpg", width: 612, height: 408 },
  { src: "5.jpg", width: 612, height: 408 },
  { src: "6.jpg", width: 407, height: 612 },
  { src: "7.jpg", width: 612, height: 407 },
  { src: "9.jpg", width: 422, height: 612 },
  { src: "10.jpg", width: 612, height: 408 },
];

const PuzzlePage = () => {
  const [selectedImage, setSelectedImage] = useState<ImageDetails | null>(null);

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-gray-50">
      <div className="hidden" />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-green-700">Jouer au puzzle</h1>
        {!selectedImage ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {IMAGES.map((imgDetails) => (
              <button
                key={imgDetails.src}
                className="rounded-xl overflow-hidden shadow-lg border-4 border-transparent hover:border-green-500 transition"
                onClick={() => setSelectedImage(imgDetails)}
              >
                <Image
                  src={`/images/${imgDetails.src}`}
                  alt={imgDetails.src}
                  width={300}
                  height={200}
                  className="object-cover w-full h-48"
                />
              </button>
            ))}
          </div>
        ) : (
          <PuzzleGame 
            imageFile={selectedImage.src} 
            imageWidth={selectedImage.width} 
            imageHeight={selectedImage.height} 
            onRestart={() => setSelectedImage(null)} 
          />
        )}
      </main>
    </div>
  );
};

export default PuzzlePage;












