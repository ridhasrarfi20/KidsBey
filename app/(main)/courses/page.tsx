import Image from "next/image";
import { getCourses, getUserProgress } from "@/db/queries";

import { List } from "./list";

const CoursesPage = async () => {
  const coursesData = getCourses();
  const userProgressData = getUserProgress();

  const [courses, userProgress] = await Promise.all([
    coursesData,
    userProgressData,
  ]);

  return (
    <div className="relative mx-auto h-full max-w-[912px] px-3 py-6">
      {/* Decorative elements */}
      <div className="absolute -right-20 -top-10 h-40 w-40 rounded-full bg-[#E6C17A]/10 blur-2xl" />
      <div className="absolute -left-10 bottom-20 h-60 w-60 rounded-full bg-[#C76C4E]/5 blur-3xl" />
      
      {/* Header section */}
      <div className="mb-8 rounded-xl bg-gradient-to-br from-[#E6C17A]/20 to-[#C76C4E]/10 p-6 shadow-sm">
        <h1 className="mb-3 text-3xl font-bold text-[#4B5E3D] text-center">
          التاريخ حكاية الزمن، فلنستمع إليه.
        </h1>
        <p className="text-lg text-[#C76C4E]/80 text-center">
          Découvrez la richesse culturelle de la Tunisie à travers nos quizs interactifs
        </p>
      </div>

      {/* Main content */}
      <div className="relative rounded-xl bg-white/80 p-6 shadow-sm backdrop-blur-sm">
        <List courses={courses} activeCourseId={userProgress?.activeCourseId} />
      </div>
      
      {/* Footer note */}
      <div className="mt-6 text-center text-sm text-[#4B5E3D]/70">
        Chaque cours vous rapproche de la maîtrise de la culture de la madina de Tunisie
      </div>
    </div>
  );
};

export default CoursesPage;
