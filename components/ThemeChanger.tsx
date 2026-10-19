"use client";

import { Palette } from "lucide-react";
import { ChangeEvent, useEffect, useRef } from "react";
import { Select } from "@/components/ui/select";

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

const defaultTheme = themes[0].value;
const storageKey = "commerce-theme";

export default function ThemeChanger() {
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey);
    const nextTheme = themes.some((option) => option.value === savedTheme)
      ? savedTheme!
      : defaultTheme;

    if (selectRef.current) selectRef.current.value = nextTheme;
    document.documentElement.setAttribute("data-theme", nextTheme);
  }, []);

  function changeTheme(event: ChangeEvent<HTMLSelectElement>) {
    const nextTheme = event.target.value;
    localStorage.setItem(storageKey, nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  }

  return (
    <label className="flex items-center gap-2" title="Change theme">
      <Palette className="size-4" aria-hidden="true" />
      <span className="sr-only">Theme</span>
      <Select
        ref={selectRef}
        className="w-28"
        defaultValue={defaultTheme}
        onChange={changeTheme}
        aria-label="Theme"
      >
        {themes.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </label>
  );
}
