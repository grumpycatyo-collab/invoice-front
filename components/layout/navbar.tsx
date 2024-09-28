"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useScroll from "@/lib/hooks/use-scroll";
import { useAuthModal } from "./sign-in-modal";
import UserDropdown from "./user-dropdown";
import { Session } from "next-auth";

export default function NavBar({ session }: { session: Session | null }) {
  const { AuthModal, setShowAuthModal } = useAuthModal();
  const scrolled = useScroll(50);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        try {
          const response = await fetch('http://localhost:8005/users/me', {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          if (response.ok) {
            const userData = await response.json();
            setUserName(userData.user.name);
          } else {
            // Token might be invalid or expired
            localStorage.removeItem('access_token');
            setUserName(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserName(null);
        }
      } else {
        setUserName(null);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <>
      <AuthModal />
      <div
        className={`fixed top-0 w-full flex justify-center ${
          scrolled
            ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
            : "bg-white/0"
        } z-30 transition-all`}
      >
        <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between w-full">
          <Link href="/" className="flex items-center font-display text-2xl">
            <p>La Chocolat Converter</p>
          </Link>
          <div>
          {isLoading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : userName ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Welcome,</span>
                <span className="text-sm font-bold">{userName}</span>
              </div>
            ) : (
              <button
                className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
                onClick={() => setShowAuthModal(true)}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}