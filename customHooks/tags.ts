import { ChangeEvent, useState } from "react";

export function useTags() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const onTagChange = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    const cur = e.target.value;
    if (cur.endsWith(",")) {
      const curTag = cur.slice(0, -1);
      setSelectedTags((prev) => [...new Set([...prev, curTag])]);
      e.target.value = "";
    }
  };

  const addTags = (tag: string) => {
    setSelectedTags((prev) => prev.filter((cur) => cur !== tag));
  };

  return {selectedTags, setSelectedTags, onTagChange, addTags}
}
