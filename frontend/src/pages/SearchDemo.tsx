// frontend/src/pages/SearchDemo.tsx
import { useState, useEffect } from "react";
import { ContactsAPI, type Contact } from "../api/client";

export default function SearchDemo() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      const data = await ContactsAPI.list(query);
      setResults(data);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div style={{ padding: 20 }}>
      <h2>🔍 リアルタイム検索デモ</h2>
      <input
        type="text"
        placeholder="名前またはメールを入力"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: 8, width: "60%" }}
      />
      {loading && <p>検索中...</p>}
      <ul>
        {results.map((r) => (
          <li key={r.id}>{r.name} ({r.email})</li>
        ))}
      </ul>
    </div>
  );
}
