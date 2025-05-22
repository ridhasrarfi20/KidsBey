import { ClerkLoading, ClerkLoaded, UserButton } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { SidebarItem } from "./sidebar-item";

type SidebarProps = {
  className?: string;
};

export const Sidebar = ({ className }: SidebarProps) => {
  return (
    <div
      className={cn(
        "left-0 top-0 flex h-full flex-col border-r-2 px-4 lg:fixed lg:w-[256px]",
        className
      )}
    >
      <Link href="/learn">
        <div className="flex items-center gap-x-3 pb-7 pl-4 pt-8">
          <Image src="/logo.png" alt="logo" height={40} width={40} />

          <h1 className="text-2xl font-extrabold tracking-wide text-[#06668C]">
            KidsBey
          </h1>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-y-2">
        <SidebarItem label="Apprendre" href="/book" iconSrc="/livre.png" />
        <SidebarItem label="carrière" href="/learn" iconSrc="/learn.png" />
        {/* <SidebarItem
  label="Leaderboard"
  href="/leaderboard"
  iconSrc="/leaderboard.svg"
/> }
        <SidebarItem label="Quests" href="/quests" iconSrc="/quests.svg" />
        {/* <SidebarItem label="Shop" href="/shop" iconSrc="/shop.svg" /> */}
        <SidebarItem label="Jouer au puzzle" href="/puzzle" iconSrc="/puzzle.svg" />
      </div>

      <div className="p-4">
        <ClerkLoading>
          <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
        </ClerkLoading>

        <ClerkLoaded>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: { userButtonPopoverCard: { pointerEvents: "initial" } },
            }}
          />
        </ClerkLoaded>
      </div>
    </div>
  );
};
