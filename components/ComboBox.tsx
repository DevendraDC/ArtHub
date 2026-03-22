"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { ChevronDownIcon } from "lucide-react"
import { Dispatch, SetStateAction, useState } from "react"

const sortByItems = [
  "latest",
  "Popularity",
] as const

export function ComboBox({ sortBy, setSortBy }: { sortBy: string, setSortBy: Dispatch<SetStateAction<string>> }) {
  return (
    <Combobox items={sortByItems}>
      <ComboboxInput placeholder="Sort posts by" onChange={(e) => setSortBy(e.target.value)} />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}


export function SortByBox({ sortBy, setSortBy }: { sortBy: string, setSortBy: Dispatch<SetStateAction<string>> }) {
  const [clicked, setClicked] = useState(false);
  const sort = ["latest", "popularity"];
  return (
    <button className="border relative border-border bg-(--surface2) p-1 text-sm rounded-sm text-(--text-muted) flex gap-6 cursor-pointer" onClick={() => setClicked(prev => !prev)}>
      <div>Sort posts by {sortBy}</div>
      <ChevronDownIcon />
      {clicked && (
        <div className="absolute w-full left-0 top-[100%] bg-(--bg) p-2 flex flex-col text-(--text-light)/80 gap-2">
          {sort.map(s => (
            <div key={s} onClick={() => setSortBy(s)} className="hover:bg-(--surface2) p-1 rounded-sm">Sort posts by {s}</div>
          ))}
        </div>
      )}
    </button>
  )
}
