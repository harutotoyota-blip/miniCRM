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
    <div>
      <h2>Contacts</h2>

      {/* create form shown when not editing; when editing, show edit form above the list */}
      {!editing ? (
        <ContactForm onSubmit={addContact} />
      ) : (
        <div>
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
        <p>Loading...</p>
      ) : (
        <ul>
          {contacts.map((c) => (
            <li key={c.id} style={{ marginBottom: 6 }}>
              <strong>{c.name}</strong> ({c.email}) {c.phone ? `- ${c.phone}` : ""}
              <button onClick={() => setEditing(c)} style={{ marginLeft: 8 }}>
                Edit
              </button>
              <button onClick={() => deleteContact(c.id)} style={{ marginLeft: 8 }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
