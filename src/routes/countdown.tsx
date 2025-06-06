import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/countdown")({
  component: Countdown,
});

import { useEffect, useRef, useState } from "react";
import { numberToWords } from "../numberToWords";
import { useQueryState } from "nuqs";

// Countdown component with query param config
export function Countdown() {
  // Query params for initial values
  const [hoursParam] = useQueryState("h", {
    defaultValue: "0",
  });
  const [minutesParam] = useQueryState("m", {
    defaultValue: "0",
  });
  const [secondsParam] = useQueryState("s", {
    defaultValue: "0",
  });
  const [dirParam] = useQueryState("dir", {
    defaultValue: "left",
  });

  // Parse initial values from query params
  const initialHours = parseInt(hoursParam || "0", 10);
  const initialMinutes = parseInt(minutesParam || "0", 10);
  const initialSeconds = parseInt(secondsParam || "0", 10);

  // State for countdown
  const [remainingMs, setRemainingMs] = useState(
    (initialHours * 3600 + initialMinutes * 60 + initialSeconds) * 1000,
  );
  const [running, setRunning] = useState(true); // Start on load

  // For accurate interval
  const intervalRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  // Start/stop logic
  useEffect(() => {
    if (running && remainingMs > 0) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - lastTickRef.current;
        lastTickRef.current = now;
        setRemainingMs((ms) => Math.max(0, ms - elapsed));
      }, 50);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [remainingMs, running]);

  // Reset when query params change
  useEffect(() => {
    setRemainingMs(
      (initialHours * 3600 + initialMinutes * 60 + initialSeconds) * 1000,
    );
    setRunning(false);
  }, [
    hoursParam,
    initialHours,
    initialMinutes,
    initialSeconds,
    minutesParam,
    secondsParam,
  ]);

  // Breakdown remaining time
  const hours = Math.floor(remainingMs / 3600000);
  const minutes = Math.floor((remainingMs % 3600000) / 60000);
  const seconds = Math.floor((remainingMs % 60000) / 1000);
  const milliseconds = Math.floor(remainingMs % 1000);

  // Alignment classes
  const alignClass =
    dirParam === "right" ? "items-end text-end" : "items-start text-start";

  // Hotkey controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.target && (e.target as HTMLElement).tagName === "INPUT") return;
      switch (e.key.toLowerCase()) {
        case " ":
        case "spacebar":
          e.preventDefault();
          if (remainingMs > 0) setRunning((r) => !r);
          break;
        case "g":
          e.preventDefault();
          if (!running && remainingMs > 0) {
            setRunning(true);
            lastTickRef.current = Date.now();
          }
          break;
        case "r":
          e.preventDefault();
          setRunning(false);
          setRemainingMs(
            (initialHours * 3600 + initialMinutes * 60 + initialSeconds) * 1000,
          );
          break;
        case "d":
          e.preventDefault();
          // Toggle direction
          const newDir = dirParam === "left" ? "right" : "left";
          const url = new URL(window.location.href);
          url.searchParams.set("dir", newDir);
          window.history.replaceState({}, "", url.toString());
          // No setDirParam since we're using useQueryState read-only here
          window.location.reload();
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line
  }, [
    running,
    remainingMs,
    dirParam,
    initialHours,
    initialMinutes,
    initialSeconds,
  ]);

  return (
    <div
      className={`flex flex-col ${alignClass} p-8 bg-slate-900 h-screen w-screen`}
    >
      <div className="space-y-8 w-full max-w-md">
        <div className="space-y-6 font-mono">
          <div className="group">
            <div className="text-4xl md:text-5xl font-light text-white tracking-wider">
              {numberToWords(hours)}
            </div>
          </div>
          <div className="group">
            <div className="text-4xl md:text-5xl font-light text-white tracking-wider">
              {numberToWords(minutes)}
            </div>
          </div>
          <div className="group">
            <div className="text-4xl md:text-5xl font-light text-white tracking-wider">
              {numberToWords(seconds)}
            </div>
          </div>
          <div className="group">
            <div className="text-xl font-light text-white/80 tracking-wider">
              and {numberToWords(milliseconds)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
