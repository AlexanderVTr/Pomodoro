"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./install-prompt.module.scss";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null
  );
  const [iosOpen, setIosOpen] = useState(false);

  useEffect(() => {
    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBip);
    return () => window.removeEventListener("beforeinstallprompt", onBip);
  }, []);

  const isIos =
    typeof navigator !== "undefined" &&
    /iphone|ipad|ipod/i.test(navigator.userAgent);

  const handleInstall = useCallback(async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  }, [deferred]);

  if (deferred) {
    return (
      <button
        type="button"
        className={styles.btn}
        onClick={() => void handleInstall()}
      >
        Install
      </button>
    );
  }

  if (isIos) {
    return (
      <>
        <button
          type="button"
          className={styles.btn}
          onClick={() => setIosOpen(true)}
        >
          Install
        </button>
        {iosOpen ? (
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
          >
            <div className={styles.card}>
              <h2 id="ios-install-title">Add to Home Screen</h2>
              <p>
                Tap the Share icon in Safari, then choose{" "}
                <strong>Add to Home Screen</strong> to install this app.
              </p>
              <div className={styles.row}>
                <button
                  type="button"
                  className={styles.close}
                  onClick={() => setIosOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </>
    );
  }

  return null;
}
