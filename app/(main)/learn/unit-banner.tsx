import { NotebookText } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type UnitBannerProps = {
  title: string;
  description: string;
};

export const UnitBanner = ({ title, description }: UnitBannerProps) => {
  return (
    <div className="flex w-full items-center justify-between rounded-xl bg-[#E6C17A] p-5 text-[#C76C4E]">
      <div className="space-y-2.5">
        <h3 className="text-2xl font-bold text-[#4B5E3D]">{title}</h3>
        <p className="text-lg text-[#4B5E3D]">{description}</p>
      </div>

      <Link href="/lesson">
        <Button
          size="lg"
          className="hidden border-2 border-b-4 active:border-b-2 xl:flex bg-[#4B5E3D] hover:bg-[#4B5E3D]/90 text-white"
        >
          <NotebookText className="mr-2" />
          Continue
        </Button>
      </Link>
    </div>
  );
};
