import { useEffect, useState } from "react";
import type { CreateContactInput, UpdateContactInput } from "../api/client";

type Initial = {
  id?: number;
  name?: string;
  email?: string;
  phone?: string | null;
};

type Props = {
  onSubmit: (input: any) => Promise<void>;
  initial?: Initial;
  mode?: "create" | "edit";
  onCancel?: () => void;
};

export default function ContactForm({ onSubmit, initial, mode = "create", onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(initial?.name ?? "");
    setEmail(initial?.email ?? "");
    setPhone(initial?.phone ?? "");
    setError(null);
  }, [initial]);

  const validate = (): boolean => {
    if (!name.trim()) {
      setError("Name is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    if (mode === "create") {
      await onSubmit({ name: name.trim(), email: email.trim(), phone: phone || null });
      setName("");
      setEmail("");
      setPhone("");
    } else {
      // edit mode: typically backend allows updating name and phone only
      await onSubmit({ name: name.trim(), phone: phone || null });
      if (onCancel) onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-row">
        <input
          className="input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          aria-invalid={error && !name.trim() ? "true" : undefined}
        />
        <input
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          readOnly={mode === "edit"}
          title={mode === "edit" ? "Email cannot be changed" : undefined}
          aria-invalid={error && !email.trim() ? "true" : undefined}
        />
        <input
          className="input"
          placeholder="Phone (optional)"
          value={phone ?? ""}
          onChange={(e) => setPhone(e.target.value)}
        />

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" className="btn btn-primary">
            {mode === "create" ? "Add" : "Save"}
          </button>
          {mode === "edit" && (
            <button type="button" onClick={() => onCancel && onCancel()} className="btn btn-ghost">
              Cancel
            </button>
          )}
        </div>
      </div>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
