import type { InputHTMLAttributes } from "react";
import styles from "./number-input.module.scss";

interface NumberInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function NumberInput({ label, id, className, ...rest }: NumberInputProps) {
  return (
    <div className={`${styles.field} ${className ?? ""}`}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input id={id} type="number" className={styles.input} {...rest} />
    </div>
  );
}
