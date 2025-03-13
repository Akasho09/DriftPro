## 
interface InputCompoProps {
  children?: ReactNode;
  inputtype: "text" | "number" | "email" | "password" | "tel"; // Restrict to valid types
  label?: string;
  className?: string;
  onChange: (value: string) => void;
}

