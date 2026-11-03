import { useRouter } from "expo-router";
import { useCallback, useRef } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import DiaryCard from "../../src/components/DiaryCard";
import { useDiary } from "../../src/context/DiaryContext";
import { useDiarySearch } from "../../src/hooks/useDiarySearch";

// Pastikan emoji sesuai dengan modul praktikum atau data context Anda
const MOODS = ["😀", "🎯", "😂", "😴"];

export default function HomeScreen() {
  const router = useRouter();
  const { entries, likedIds, toggleLike } = useDiary();

  const {
    query,
    setQuery,
    moodFilter,
    setMoodFilter,
    filteredEntries,
    resultCount,
    resetFilter,
  } = useDiarySearch(entries);

  const searchRef = useRef<{ focus: () => void } | null>(null);

  const openDetail = useCallback(
    (id: number) => {
      router.push({
        pathname: "/detail/[id]" as any,
        params: { id: String(id) },
      });
    },
    [router],
  );

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchRow}>
        <TextInput
          ref={searchRef as any}
          value={query}
          onChangeText={setQuery}
          placeholder="Cari judul atau isi..."
          style={styles.search}
          placeholderTextColor="#888"
        />
      </View>

      {/* Filter Mood Chips */}
      <View style={styles.moodFilterContainer}>
        <Text style={styles.filterLabel}>Filter Mood:</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={MOODS}
          keyExtractor={(item) => item}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setMoodFilter(moodFilter === item ? "" : item)}
              style={[
                styles.moodChip,
                moodFilter === item && styles.moodChipActive,
              ]}
            >
              <Text style={styles.moodChipText}>{item}</Text>
            </Pressable>
          )}
        />
      </View>

      {/* Meta Row & Reset Button */}
      <View style={styles.metaRow}>
        <Text style={styles.counter}>{resultCount} entri ditemukan</Text>
        {(query !== "" || moodFilter !== "") && (
          <Pressable onPress={resetFilter} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Reset Filter</Text>
          </Pressable>
        )}
      </View>

      {/* List Diary */}
      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <DiaryCard
            title={item.title}
            date={item.date}
            preview={item.preview}
            mood={item.mood}
            liked={likedIds.has(item.id)}
            onPress={() => openDetail(item.id)}
            onToggleLike={() => toggleLike(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tidak ada diary yang cocok.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: "#F0F8FF", // Light blue modern
  },
  searchRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  search: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#333",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  moodFilterContainer: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#003366",
    marginBottom: 8,
  },
  moodChip: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0F0FF",
  },
  moodChipActive: {
    backgroundColor: "#E0F0FF",
    borderColor: "#007AFF",
  },
  moodChipText: {
    fontSize: 18,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  counter: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  resetButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  resetButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  list: {
    gap: 16,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
  },
});
