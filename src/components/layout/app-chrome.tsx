"use client";

import type { ReactNode } from "react";
import { NavBar } from "./NavBar";
import { ThemeDom } from "./theme-dom";
import { SessionChrome } from "@/components/providers/session-chrome";

interface AppChromeProps {
  children: ReactNode;
}

export function AppChrome({ children }: AppChromeProps) {
  return (
    <>
      <ThemeDom />
      <SessionChrome />
      <NavBar />
      {children}
    </>
  );
}
