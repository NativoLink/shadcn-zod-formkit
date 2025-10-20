# React Dynamic Form Maker

📦 A React library for creating **dynamic forms** with **Zod validations**, supporting multiple input types: text, number, email, switch, color, date, select, file, and OTP.

---

## 📌 Installation

```bash
# Using npm
npm install @nativolink/react-form-maker-lib

# Using yarn
yarn add @nativolink/react-form-maker-lib
```


##  🛠️ Basic Usage

```bash
export const App = ()  => {
  const record= {
    username: "John Doe ",
    email: "johndoe@example.com",
    isActive: true,
    favoriteColor: undefined,
    age: 25,
    role: "editor",
  };

  return (
    <DynamicForm
      fields={mockFields}
      record={record}
      onSubmit={(data) => console.log("📤 Resultado final:", data)}
    />
  );
}
```


## ✅ Features
  - Fully dynamic fields array support.
  - Multiple input types (text, email, number, color, date, select, switch, file, OTP).
  - Zod validation integration for robust form validation.
  - Supports default values via record prop.
  - Works seamlessly with React 18+ and TypeScript.

## 💡 Tips
  - Use peerDependencies for React to avoid version conflicts.
  - Wrap your forms inside a "use client" component if using Next.js App Router.
- Combine multiple FieldProps in arrays for grouped fields (like age + color).