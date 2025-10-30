import { useEffect, useState } from "react";
import { ContactsAPI, type Contact } from "../api/client";
import ContactForm from "../components/ContactForm";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

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

  const deleteContact = async (id: number) => {
    await ContactsAPI.remove(id);
    await load();
  };

  return (
    <div>
      <h2>Contacts</h2>
      <ContactForm onSubmit={addContact} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {contacts.map((c) => (
            <li key={c.id}>
              {c.name} ({c.email}) {c.phone ? `- ${c.phone}` : ""}
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
