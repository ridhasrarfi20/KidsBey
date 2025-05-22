import { Check } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type CardProps = {
  title: string;
  id: number;
  imageSrc: string;
  onClick: (id: number) => void;
  disabled?: boolean;
  isActive?: boolean;
};

export const Card = ({
  title,
  id,
  imageSrc,
  onClick,
  disabled,
  isActive,
}: CardProps) => {
  return (
    <motion.div
      onClick={() => onClick(id)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: id * 0.1 }}
      whileHover={{ 
        scale: 1.03, 
        y: -8,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "flex h-[280px] w-[250px] cursor-pointer flex-col items-center justify-between rounded-2xl p-5 transition-all duration-300",
        isActive 
          ? "bg-gradient-to-br from-[#E6C17A]/30 to-[#C76C4E]/20 shadow-xl" 
          : "bg-white shadow-md hover:shadow-xl",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      <div className="flex min-h-[24px] w-full items-center justify-end">
        {isActive && (
          <motion.div 
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex items-center justify-center rounded-full bg-[#C76C4E] p-2 shadow-lg"
          >
            <Check className="h-5 w-5 stroke-[3] text-white" />
          </motion.div>
        )}
      </div>

      {imageSrc && (
        <div className="relative h-[160px] w-[200px] overflow-hidden rounded-xl shadow-md transition-all duration-300">
          <motion.div
            className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#E6C17A] via-[#C76C4E] to-[#4B5E3D] opacity-30 blur-sm"
            animate={{ 
              opacity: isActive ? [0.3, 0.6, 0.3] : 0.3 
            }}
            transition={{ 
              duration: 2, 
              repeat: isActive ? Infinity : 0,
              repeatType: "reverse" 
            }}
          />
          <img
            src={imageSrc}
            alt={title}
            className="relative h-full w-full rounded-xl object-cover transition-transform duration-700 hover:scale-110"
          />
        </div>
      )}

      <div className="mt-4 w-full">
        <p className="text-center text-lg font-bold text-[#4B5E3D] drop-shadow-sm">{title}</p>
      </div>
      

    </motion.div>
  );
};
