"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

const sortBy = [
  "Time",
  "Popularity",
  "",
  "Remix",
  "Astro",
] as const

export function ComboboxBasic() {
  return (
    <Combobox items={sortBy}>
      <ComboboxInput placeholder="Sort posts by" />
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
