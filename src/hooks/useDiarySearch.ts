import { useEffect, useMemo, useState } from "react";
import { DiaryEntry } from "../context/DiaryContext";

export function useDiarySearch(entries: DiaryEntry[]) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [moodFilter, setMoodFilter] = useState("");

  // Effect untuk Debounce Pencarian Text
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  // Memo untuk Filter (Teks & Mood)
  const filteredEntries = useMemo(() => {
    let result = entries;

    const q = debouncedQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (entry) =>
          entry.title.toLowerCase().includes(q) ||
          entry.preview.toLowerCase().includes(q) ||
          entry.date.toLowerCase().includes(q),
      );
    }

    if (moodFilter) {
      result = result.filter((entry) => entry.mood === moodFilter);
    }

    return result;
  }, [entries, debouncedQuery, moodFilter]);

  const resetFilter = () => {
    setQuery("");
    setMoodFilter("");
  };

  return {
    query,
    setQuery,
    moodFilter,
    setMoodFilter,
    filteredEntries,
    resultCount: filteredEntries.length,
    resetFilter,
  };
}
