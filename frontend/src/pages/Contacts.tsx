import { useEffect, useState } from "react";
import { ContactsAPI, type Contact } from "../api/client";
import ContactForm from "../components/ContactForm";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Contact | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await ContactsAPI.list();
    setContacts(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const addContact = async (input: { name: string; email: string; phone?: string | null }) => {
    await ContactsAPI.create(input);
    await load();
  };

  const updateContact = async (input: { name?: string; phone?: string | null }) => {
    if (!editing) return;
    await ContactsAPI.update(editing.id, input);
    setEditing(null);
    await load();
  };

  const deleteContact = async (id: number) => {
    if (!confirm("Delete this contact?")) return;
    await ContactsAPI.remove(id);
    await load();
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Contacts</h1>
      </div>

      {/* create form shown when not editing; when editing, show edit form above the list */}
      {!editing ? (
        <ContactForm onSubmit={addContact} />
      ) : (
        <div style={{ marginBottom: 8 }}>
          <h3>Editing: {editing.name}</h3>
          <ContactForm
            mode="edit"
            initial={{ id: editing.id, name: editing.name, email: editing.email, phone: editing.phone }}
            onSubmit={updateContact}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="list">
          {contacts.map((c) => (
            <div key={c.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <strong>{c.name}</strong>
                  <div className="meta">{c.email}</div>
                </div>
                <div className="meta">{c.phone ?? ''}</div>
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
