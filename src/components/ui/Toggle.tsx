import type { InputHTMLAttributes } from "react";
import styles from "./toggle.module.scss";

interface ToggleProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

export function Toggle({ label, checked, className, ...rest }: ToggleProps) {
  return (
    <label className={`${styles.root} ${className ?? ""}`}>
      <input
        type="checkbox"
        className={styles.input}
        checked={checked}
        {...rest}
      />
      <span
        className={`${styles.track} ${checked ? styles.trackOn : ""}`}
        aria-hidden
      >
        <span className={`${styles.knob} ${checked ? styles.knobOn : ""}`} />
      </span>
      <span className={styles.label}>{label}</span>
    </label>
  );
}
