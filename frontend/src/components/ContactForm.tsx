import { useState } from "react";
import type { CreateContactInput } from "../api/client";

type Props = {
  onSubmit: (input: CreateContactInput) => Promise<void>;
};

export default function ContactForm({ onSubmit }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ name, email, phone: phone || null });
    setName("");
    setEmail("");
    setPhone("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <button type="submit">Add</button>
    </form>
  );
}
