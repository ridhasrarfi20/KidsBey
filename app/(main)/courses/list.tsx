"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { upsertUserProgress } from "@/actions/user-progress";
import { courses, userProgress } from "@/db/schema";

import { Card } from "./card";

type ListProps = {
  courses: (typeof courses.$inferSelect)[];
  activeCourseId?: typeof userProgress.$inferSelect.activeCourseId;
};

export const List = ({ courses, activeCourseId }: ListProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onClick = (id: number) => {
    if (pending) return;

    if (id === activeCourseId) return router.push("/learn");

    startTransition(() => {
      upsertUserProgress(id).catch(() => toast.error("Something went wrong."));
    });
  };

  return (
    <div className="relative">
      <div className="mb-6"></div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[#E6C17A]/20 blur-xl"
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-[#C76C4E]/10 blur-xl"
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="absolute left-1/2 top-1/3 h-20 w-20 -translate-x-1/2 rounded-full bg-[#4B5E3D]/5 blur-lg"
      />
      
      <motion.div
        className="absolute inset-0 z-0 bg-gradient-to-br from-transparent via-[#E6C17A]/5 to-transparent"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
      />
      
      <div className="flex flex-col gap-10">
        {/* First row - exactly 3 cards */}
        <div className="flex justify-center" style={{ gap: '32px' }}>
          {courses.slice(0, 3).map((course) => (
            <Card
              key={course.id}
              id={course.id}
              title={course.title}
              imageSrc={course.imageSrc}
              onClick={onClick}
              disabled={pending}
              isActive={course.id === activeCourseId}
            />
          ))}
        </div>
        
        {/* Second row - exactly 2 cards */}
        <div className="mx-auto flex w-fit" style={{ gap: '32px' }}>
          {courses.slice(3, 5).map((course) => (
            <Card
              key={course.id}
              id={course.id}
              title={course.title}
              imageSrc={course.imageSrc}
              onClick={onClick}
              disabled={pending}
              isActive={course.id === activeCourseId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
