"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/search?q=${encodeURIComponent(value)}` : "/");
  }

  return (
    <form onSubmit={submit} className="w-full">
      <input className="input input-bordered w-full" type="search" value={query}
        onChange={(event) => setQuery(event.target.value)} placeholder="Search products..." aria-label="Search products" />
    </form>
  );
}
