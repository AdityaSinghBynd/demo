"use client";

import Image from "next/image";
import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ByndLogo from "../../../public/Images/ByndLogo.svg";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogoutClick = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <nav className="flex items-center justify-between px-5 py-3 border border-b-[#DEE6F5] bg-white shadow-sm">
      <Link href="/" className="flex items-center">
        <Image
          src={ByndLogo}
          alt="ByndLogo"
          style={{ objectFit: "contain" }}
          priority
        />
      </Link>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button className="p-2 border border-[#EAF0FC] rounded-full">
            <User className="h-5 w-5" />
            <span className="sr-only">User menu</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="flex gap-2 itemx-center justify-start w-full"
        >
          <DropdownMenuItem
            className="py-2 w-full cursor-pointer"
            onClick={handleLogoutClick}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
