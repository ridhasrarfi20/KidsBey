import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  auth,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";


export const Header = () => {
  auth();

  return (
    <header className="w-full border-b-2 border-slate-200 h-16 sm:h-20 px-2 sm:px-4">
      <div className="mx-auto flex flex-col sm:flex-row h-full items-center justify-between w-full max-w-full sm:max-w-screen-lg">
        <Link href="/" className="flex flex-col sm:flex-row items-center gap-x-2 gap-y-1 sm:gap-x-3 pb-2 sm:pb-7 pl-0 sm:pl-4 pt-2 sm:pt-8">
          <Image 
            src="/logo.png" 
            alt="KidsBey logo" 
            height={45} 
            width={45} 
            className="rounded-md shadow-sm" 
          />

          <h1 className="text-lg sm:text-2xl font-extrabold tracking-wide text-[#06668C]">
            KidsBey
          </h1>
        </Link>

        <div className="flex gap-x-3">
          <ClerkLoading>
            <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
          </ClerkLoading>
          <ClerkLoaded>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            <SignedOut>
              <SignInButton
                mode="modal"
                afterSignInUrl="/learn"
                afterSignUpUrl="/learn"
              >
                <Button variant="ghost" className="px-3 py-1 text-xs sm:px-5 sm:py-2 sm:text-base">
                  S'inscrire
                </Button>
              </SignInButton>
            </SignedOut>

            
          </ClerkLoaded>
        </div>
      </div>
    </header>
  );
};
