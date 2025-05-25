"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react"; // You can also use other icons from lucide-react

interface NavbarProps {
    userId: number; // Adjust type as needed
  }

export default function Navbar({ userId }: NavbarProps) {
  const router = useRouter();

  const handleAccountClick = () => {
    router.push(`/account?userId=${userId}`);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/40 backdrop-blur-md shadow-sm">
  <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
    
    {/* Left Spacer */}
    <div className="w-10" />

    {/* Centered Title */}
    <h1 className="flex-1 text-center text-2xl font-semibold text-gray-900 tracking-wide select-none">
      Rail<span className="text-blue-600">Xpress</span>
    </h1>

    {/* Account Button */}
    <div className="w-10 flex justify-end">
      <Button variant="ghost" size="icon" onClick={handleAccountClick}>
        <User className="h-5 w-5 text-gray-700" />
      </Button>
    </div>
  </div>
</header>
  );
}
