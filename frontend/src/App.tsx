import ContactsPage from "./pages/Contacts";
import "./styles.css";

export default function App() {
  return (
    <main className="app">
      <div className="container">
        <div className="header">
          <h1>miniCRM</h1>
        </div>
        <ContactsPage />
      </div>
    </main>
  );
}
