"use client";

import { Palette } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const themes = [
  { value: "default", label: "Default" },
  { value: "dark", label: "Dark" },
  { value: "synthwave", label: "Synthwave" },
  { value: "midnight-luxe", label: "Midnight Luxe" },
  { value: "mint-fresh", label: "Mint Fresh" },
  { value: "sunset-bazaar", label: "Sunset Bazaar" },
  { value: "paper-ink", label: "Paper & Ink" },
  { value: "neon-street", label: "Neon Street" },
  { value: "blush-boutique", label: "Blush Boutique" },
  { value: "ocean-depot", label: "Ocean Depot" },
  { value: "terra-home", label: "Terra Home" },
  { value: "candy-pop", label: "Candy Pop" },
] as const;

type ThemeValue = (typeof themes)[number]["value"];

const defaultTheme = themes[0].value;
const storageKey = "commerce-theme";

export default function ThemeChanger() {
  const currentThemeRef = useRef<ThemeValue>(defaultTheme);
  const [currentTheme, setCurrentTheme] =
    useState<ThemeValue>(defaultTheme);

  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey);
    const nextTheme = themes.some((option) => option.value === savedTheme)
      ? (savedTheme as ThemeValue)
      : defaultTheme;

    currentThemeRef.current = nextTheme;
    document.documentElement.setAttribute("data-theme", nextTheme);
  }, []);

  function cycleTheme() {
    const currentIndex = themes.findIndex(
      (theme) => theme.value === currentThemeRef.current,
    );
    const nextTheme = themes[(currentIndex + 1) % themes.length].value;

    currentThemeRef.current = nextTheme;
    setCurrentTheme(nextTheme);
    localStorage.setItem(storageKey, nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  }

  const activeTheme = themes.find((theme) => theme.value === currentTheme);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      title={`Theme: ${activeTheme?.label ?? "Default"}. Click to change`}
      aria-label={`Theme: ${activeTheme?.label ?? "Default"}. Click to change`}
      className = "hover:cursor-pointer"
    >
      <Palette className="size-4 " aria-hidden="true" />
    </Button>
  );
}
