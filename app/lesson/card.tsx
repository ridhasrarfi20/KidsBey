import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAudio, useKey } from "react-use";
import { Play } from "lucide-react";

import { challenges } from "@/db/schema";
import { cn } from "@/lib/utils";

type CardProps = {
  id: number;
  text: string;
  imageSrc: string | null;
  audioSrc: string | null;
  shortcut: string;
  selected?: boolean;
  onClick: () => void;
  status?: "correct" | "wrong" | "none";
  disabled?: boolean;
  type: (typeof challenges.$inferSelect)["type"];
};

export const Card = ({
  text,
  imageSrc,
  audioSrc,
  shortcut,
  selected,
  onClick,
  status,
  disabled,
  type,
}: CardProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [audio, _, controls] = useAudio({ src: audioSrc || "" });

  const handleClick = useCallback(() => {
    if (disabled) return;
    void controls.play();
    onClick();
  }, [disabled, onClick, controls]);

  useKey(shortcut, handleClick, {}, [handleClick]);

  // Animated border color
  let borderColor = "border-transparent";
  let glow = "";
  if (selected) borderColor = "border-sky-400";
  if (selected && status === "correct") {
    borderColor = "border-green-400";
    glow = "shadow-[0_0_16px_4px_rgba(34,197,94,0.25)]";
  }
  if (selected && status === "wrong") {
    borderColor = "border-rose-400";
    glow = "shadow-[0_0_16px_4px_rgba(244,63,94,0.18)]";
  }

  return (
    <motion.div
      layout
      whileHover={!disabled ? { scale: 1.03, boxShadow: "0 8px 24px rgba(0,0,0,0.10)" } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={handleClick}
      className={cn(
        "relative w-full max-w-xs h-full cursor-pointer rounded-2xl border-4 p-2 sm:p-4 lg:p-6 shadow-lg bg-white/70 backdrop-blur-md flex flex-col gap-3 items-center overflow-hidden transition-all duration-300",
        borderColor,
        glow,
        disabled && "pointer-events-none opacity-60",
        type === "ASSIST" && "w-full lg:p-3"
      )}
      style={{ background: "linear-gradient(135deg, rgba(230,193,122,0.08), rgba(199,108,78,0.06) 60%, rgba(75,94,61,0.06))" }}
    >
      {audio}
      {/* Glass/gradient overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 via-[#E6C17A]/10 to-[#C76C4E]/10 backdrop-blur-md z-0" />
      {/* Logo background overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-0">
        <img
          src="/logo.png"
          alt="Logo background"
          className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 opacity-10 blur-sm grayscale select-none"
          style={{ objectFit: 'contain' }}
        />
      </div>
      {/* Image + overlays */}
      {imageSrc && (
        <div className="relative mb-3 aspect-square max-h-[100px] sm:max-h-[150px] w-full overflow-hidden rounded-xl shadow-md z-10">
          <Image src={imageSrc} fill alt={text} className="object-cover" />
          {/* Floating shortcut badge */}
          <div className="absolute top-2 right-2 z-20">
            <div
              className={cn(
                "flex h-[28px] w-[28px] sm:h-[32px] sm:w-[32px] items-center justify-center rounded-lg border-2 text-sm sm:text-base font-semibold text-neutral-400 bg-white shadow transition-all duration-200",
                selected && "border-sky-400 text-sky-500",
                selected && status === "correct" && "border-green-500 text-green-500",
                selected && status === "wrong" && "border-rose-500 text-rose-500"
              )}
            >
              {shortcut}
            </div>
          </div>
          {/* Play button overlay if audioSrc */}
          {audioSrc && (
            <button
              onClick={e => { e.stopPropagation(); controls.play(); }}
              className="absolute bottom-2 left-2 z-20 flex items-center justify-center rounded-full bg-white/80 p-1 shadow hover:bg-white"
              tabIndex={-1}
              aria-label="Play audio"
            >
              <Play className="h-5 w-5 text-[#C76C4E]" />
            </button>
          )}
        </div>
      )}

      {/* Card content */}
      <div
        className={cn(
          "flex flex-col items-center justify-between gap-2 w-full z-10",
          type === "ASSIST" && "flex-row-reverse"
        )}
      >
        {type === "ASSIST" && <div aria-hidden />}
        <p
          className={cn(
            "text-base sm:text-lg font-semibold text-neutral-700 text-center truncate",
            selected && "text-sky-500",
            selected && status === "correct" && "text-green-500",
            selected && status === "wrong" && "text-rose-500"
          )}
        >
          {text}
        </p>
      </div>
      {/* Animated checkmark for correct */}
      <AnimatePresence>
        {selected && status === "correct" && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute bottom-3 right-3 z-20 flex items-center justify-center rounded-full bg-green-400/90 p-1 shadow-lg"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
              <path d="M5 10.5l4 4 6-7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        )}
        {selected && status === "wrong" && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute bottom-3 right-3 z-20 flex items-center justify-center rounded-full bg-rose-400/90 p-1 shadow-lg"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
              <path d="M6 6l8 8M6 14L14 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
