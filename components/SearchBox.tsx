"use client";

import { useRouter } from "next/navigation";
import { SubmitEvent  , useState } from "react";
import { Input } from "@/components/ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group"

export default function SearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/search?q=${encodeURIComponent(value)}` : "/");
  }
  return (
      <div className="flex w-full items-center gap-2 rounded-md relative">
        <form onSubmit={submit} className="w-full relative">
            <ButtonGroup className="w-full gap-1">
              <Input id="input-button-group" placeholder="Type to search..." onChange={(e) => setQuery(e.target.value)}/>
              <Button variant="outline" type="submit" className="hover:cursor-pointer">
                <FontAwesomeIcon icon={faSearch} className="size-4" aria-hidden="true" />
              </Button>
            </ButtonGroup>
        </form>
      </div>
  );
}
