import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./button.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  type = "button",
  className,
  disabled,
  children,
  ...rest
}: ButtonProps) {
  const cls = [
    variant === "primary" && styles.primary,
    variant === "ghost" && styles.ghost,
    variant === "danger" && styles.danger,
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={cls} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
