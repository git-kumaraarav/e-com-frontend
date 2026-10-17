"use client";

import { Palette } from "lucide-react";
import { ChangeEvent, useEffect, useRef } from "react";

const themes = [
  { value: "corporate", label: "Corporate" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "cupcake", label: "Cupcake" },
  { value: "synthwave", label: "Synthwave" },
  { value: "forest", label: "Forest" },
  { value: "aqua", label: "Aqua" },
  { value: "sunset", label: "Sunset" },
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
      <select
        ref={selectRef}
        className="select select-bordered select-sm w-28"
        defaultValue={defaultTheme}
        onChange={changeTheme}
        aria-label="Theme"
      >
        {themes.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
