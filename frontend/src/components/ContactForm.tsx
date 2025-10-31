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
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; phone?: string }>({});

  useEffect(() => {
    setName(initial?.name ?? "");
    setEmail(initial?.email ?? "");
    setPhone(initial?.phone ?? "");
    setError(null);
    setFieldErrors({});
  }, [initial]);

  const validate = (): boolean => {
    const errs: { name?: string; email?: string; phone?: string } = {};
    if (!name.trim()) {
      errs.name = "Name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errs.email = "Enter a valid email address";
    }

    if (phone && phone.trim()) {
      const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
      if (!phoneRegex.test(phone)) {
        errs.phone = "Enter a valid phone number";
      }
    }

    setFieldErrors(errs);
    const firstError = errs.name ?? errs.email ?? errs.phone ?? null;
    setError(firstError);
    return Object.keys(errs).length === 0;
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
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <input
            className="input"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            aria-invalid={fieldErrors.name ? 'true' : undefined}
          />
          {fieldErrors.name && <small className="error">{fieldErrors.name}</small>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <input
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            readOnly={mode === "edit"}
            title={mode === "edit" ? "Email cannot be changed" : undefined}
            aria-invalid={fieldErrors.email ? 'true' : undefined}
          />
          {fieldErrors.email && <small className="error">{fieldErrors.email}</small>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <input
            className="input"
            placeholder="Phone (optional)"
            value={phone ?? ""}
            onChange={(e) => setPhone(e.target.value)}
            aria-invalid={fieldErrors.phone ? 'true' : undefined}
          />
          {fieldErrors.phone && <small className="error">{fieldErrors.phone}</small>}
        </div>

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
    </form>
  );
}
