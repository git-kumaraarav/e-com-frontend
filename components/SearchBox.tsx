"use client";

import { useRouter } from "next/navigation";
import { SubmitEvent  , useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group"
import { Field, FieldLabel } from "@/components/ui/field"

export default function SearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/search?q=${encodeURIComponent(value)}` : "/");
  }
  return (
      <div className="flex w-full items-center gap-2 rounded-md px-3 py-2 relative">
        <form onSubmit={submit} className="w-full relative">
            <ButtonGroup className="w-full gap-1">
              <Input id="input-button-group" placeholder="Type to search..." onChange={(e) => setQuery(e.target.value)}/>
              <Button variant="outline" type="submit" className="hover:cursor-pointer">
                <Search className="size-4" aria-hidden="true" />
              </Button>
            </ButtonGroup>
        </form>
      </div>
  );
}
