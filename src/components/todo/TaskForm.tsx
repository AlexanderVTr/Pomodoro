"use client";

import { useState } from "react";
import { addTask } from "@/lib/db/queries";
import { Button } from "@/components/ui/Button";
import styles from "./task-form.module.scss";

export function TaskForm() {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    void addTask(title).then(() => setTitle(""));
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What are you working on?"
        aria-label="New task"
      />
      <Button type="submit" variant="primary">
        Add
      </Button>
    </form>
  );
}
