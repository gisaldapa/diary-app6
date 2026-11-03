import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { useDiary } from "../../src/context/DiaryContext";

const MOODS = ["😀", "🎯", "😂", "😴"];

export default function CreateScreen() {
  const router = useRouter();
  const { addEntry } = useDiary();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("2026-11-02");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState(MOODS[0]); // default state

  const canSave = title.trim().length > 0 && body.trim().length > 0;

  const save = () => {
    if (!canSave) return;

    // Properti 'id' di-handle context
    addEntry({
      title: title.trim(),
      date: date.trim(),
      preview: body.trim().slice(0, 80) + "...",
      body: body.trim(),
      mood,
    });

    setTitle("");
    setBody("");
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Judul Diary"
        style={styles.input}
        placeholderTextColor="#888"
      />
      <TextInput
        value={date}
        onChangeText={setDate}
        placeholder="YYYY-MM-DD"
        style={styles.input}
        placeholderTextColor="#888"
      />
      <TextInput
        value={body}
        onChangeText={setBody}
        placeholder="Ceritakan harimu..."
        multiline
        style={[styles.input, styles.bodyInput]}
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Pilih Mood Hari Ini</Text>
      <View style={styles.moodRow}>
        {MOODS.map((item) => (
          <Pressable
            key={item}
            onPress={() => setMood(item)}
            style={[styles.moodButton, mood === item && styles.moodSelected]}
          >
            <Text style={styles.moodText}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={save}
        disabled={!canSave}
        style={[styles.saveButton, !canSave && styles.disabled]}
      >
        <Text style={styles.saveText}>Simpan Diary</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0F8FF",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0F0FF",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 16,
    fontSize: 16,
    color: "#333",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  bodyInput: {
    minHeight: 150,
    textAlignVertical: "top",
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
    color: "#003366",
    marginBottom: 10,
  },
  moodRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  moodButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#E0F0FF",
    borderRadius: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  moodSelected: {
    borderColor: "#007AFF",
    backgroundColor: "#E0F0FF",
    borderWidth: 2,
  },
  moodText: {
    fontSize: 28,
  },
  saveButton: {
    padding: 16,
    backgroundColor: "#007AFF",
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  disabled: {
    opacity: 0.5,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
