import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});

export type Contact = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
};

export type CreateContactInput = {
  name: string;
  email: string;
  phone?: string | null;
};

export type UpdateContactInput = {
  name?: string;
  phone?: string | null;
};

export const ContactsAPI = {
  list: async (): Promise<Contact[]> => {
    const { data } = await api.get("/contacts");
    return data;
  },
  create: async (input: CreateContactInput): Promise<Contact> => {
    const { data } = await api.post("/contacts", input);
    return data;
  },
  update: async (id: number, input: UpdateContactInput): Promise<Contact> => {
    const { data } = await api.put(`/contacts/${id}`, input);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/contacts/${id}`);
  },
};
