"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const [managerEmail, setManagerEmail] = useState("");
  useEffect(() => {
    setManagerEmail(localStorage.getItem("managerEmail") || "");
  }, []);

  function handleLogout() {
    localStorage.removeItem("managerEmail");
    localStorage.removeItem("aareonApprovalStatus");
    localStorage.removeItem("aareon_intake_session");
    document.cookie = "aareon_session=; path=/; max-age=0";
    document.cookie = "aareon_approval=; path=/; max-age=0";
    window.location.href = "/";
  }

  return (
    <header className="border-b border-aareon-stone bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md focus:outline-none focus:ring-2 focus:ring-aareon-bright focus:ring-offset-2"
        >
          <Image src="/aareon-logo.png" alt="Aareon" width={126} height={30} priority />
        </Link>

        <div className="hidden items-center gap-4 sm:flex">
          <div className="flex items-center gap-3 text-xs font-medium text-aareon-body/70">
            <span className="h-2 w-2 rounded-full bg-aareon-bright" aria-hidden="true" />
            <span>{managerEmail || "Validating session"}</span>
          </div>

          {managerEmail && (
            <button
              onClick={handleLogout}
              aria-label="Log out"
              className="flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-aareon-body/60 transition-colors duration-150 hover:bg-aareon-stone/60 hover:text-aareon-coral focus:outline-none focus:ring-2 focus:ring-aareon-bright focus:ring-offset-2"
            >
              <LogOut size={13} aria-hidden="true" />
              <span>Log out</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
