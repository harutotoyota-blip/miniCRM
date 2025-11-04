import { useEffect, useState } from "react";
import { ContactsAPI, type Contact } from "../api/client";
import ContactForm from "../components/ContactForm";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [query, setQuery] = useState("");

  // APIからデータを取得
  const load = async (q?: string) => {
    setLoading(true);
    try {
      const data = await ContactsAPI.list(q);
      setContacts(data);
    } finally {
      setLoading(false);
    }
  };

  // 初回ロード
  useEffect(() => {
    load();
  }, []);

  // 🔍 入力中の検索をリアルタイムで反映（デバウンス付き）
  useEffect(() => {
    const delay = setTimeout(() => {
      load(query);
    }, 300); // 0.4秒待機（入力が止まったタイミングで検索）

    return () => clearTimeout(delay);
  }, [query]);

  const addContact = async (input: { name: string; email: string; phone?: string | null }) => {
    await ContactsAPI.create(input);
    await load(query);
  };

  const updateContact = async (input: { name?: string; phone?: string | null }) => {
    if (!editing) return;
    await ContactsAPI.update(editing.id, input);
    setEditing(null);
    await load(query);
  };

  const deleteContact = async (id: number) => {
    if (!confirm("Delete this contact?")) return;
    await ContactsAPI.remove(id);
    await load(query);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Contacts</h1>
      </div>

      {/* 🔍 検索バー */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: 8, width: "70%", marginRight: 8 }}
        />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setQuery("");
            load();
          }}
        >
          Clear
        </button>
      </div>

      {/* 📋 登録フォーム */}
      {!editing ? (
        <ContactForm onSubmit={addContact} />
      ) : (
        <div style={{ marginBottom: 8 }}>
          <h3>Editing: {editing.name}</h3>
          <ContactForm
            mode="edit"
            initial={{
              id: editing.id,
              name: editing.name,
              email: editing.email,
              phone: editing.phone,
            }}
            onSubmit={updateContact}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      {/* 🔄 検索中・読み込み中表示 */}
      {loading ? (
        <p className="loading">Loading...</p>
      ) : contacts.length === 0 ? (
        <p>No contacts found.</p>
      ) : (
        <div className="list">
          {contacts.map((c) => (
            <div key={c.id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div>
                  <strong>{c.name}</strong>
                  <div className="meta">{c.email}</div>
                </div>
                <div className="meta">{c.phone ?? ""}</div>
              </div>
              <div className="actions">
                <button className="btn" onClick={() => setEditing(c)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => deleteContact(c.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}