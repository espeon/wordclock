import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { numberToWords } from "../numberToWords";
import { useQueryState } from "nuqs";
import {
  Bell,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  Volume2,
} from "lucide-react";

// Classic Pomodoro defaults (in minutes)
const DEFAULTS = {
  work: 25,
  short: 5,
  long: 15,
  sessions: 4,
};

export const Route = createFileRoute("/pomodoro")({
  component: Pomodoro,
});

type Phase = "work" | "short" | "long";

const PHASE_LABELS: Record<Phase, string> = {
  work: "Work",
  short: "Short Break",
  long: "Long Break",
};

const PHASE_COLORS: Record<Phase, string> = {
  work: "bg-green-700/50",
  short: "bg-blue-700/50",
  long: "bg-purple-700/50",
};

const PHASE_COLORS_SOLID: Record<Phase, string> = {
  work: "bg-green-400",
  short: "bg-blue-400",
  long: "bg-purple-400",
};

function playSound(type: Phase) {
  try {
    const ctx = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();

    // Set base frequency based on type
    const baseFreq = type === "work" ? 880 : type === "short" ? 660 : 440;
    o.type = type === "work" ? "square" : "sine";
    o.frequency.setValueAtTime(baseFreq, ctx.currentTime);

    // Optional: add a slight pitch bend for bell effect
    o.frequency.linearRampToValueAtTime(baseFreq * 1.08, ctx.currentTime + 0.1);
    o.frequency.linearRampToValueAtTime(baseFreq, ctx.currentTime + 1.9);

    // Gain envelope for "dinggggg" decay
    g.gain.setValueAtTime(0.1, ctx.currentTime);
    g.gain.linearRampToValueAtTime(
      type === "work" ? 0.3 : 0.4,
      ctx.currentTime + 0.04,
    );
    g.gain.exponentialRampToValueAtTime(
      0.0001,
      ctx.currentTime + (1500 - baseFreq) / 1000,
    );

    o.connect(g);
    g.connect(ctx.destination);

    o.start();
    o.stop(ctx.currentTime + 1.2);
    o.onended = () => ctx.close();
  } catch {}
}

function notify(title: string, body: string) {
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }
}

// Helpers for localStorage toggles
function getStoredBool(key: string, fallback: boolean): boolean {
  if (typeof window === "undefined") return fallback;
  const v = window.localStorage.getItem(key);
  if (v === null) return fallback;
  return v === "true";
}
function setStoredBool(key: string, value: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, value ? "true" : "false");
}

export default function Pomodoro() {
  // Query params for config
  const [workParam] = useQueryState("work", {
    defaultValue: String(DEFAULTS.work),
  });
  const [shortParam] = useQueryState("short", {
    defaultValue: String(DEFAULTS.short),
  });
  const [longParam] = useQueryState("long", {
    defaultValue: String(DEFAULTS.long),
  });
  const [sessionsParam] = useQueryState("sessions", {
    defaultValue: String(DEFAULTS.sessions),
  });

  // Parse config
  const workMins = Math.max(1, parseInt(workParam || "25", 10));
  const shortMins = Math.max(1, parseInt(shortParam || "5", 10));
  const longMins = Math.max(1, parseInt(longParam || "15", 10));
  const sessionsBeforeLong = Math.max(1, parseInt(sessionsParam || "4", 10));

  // State
  const [phase, setPhase] = useState<Phase>("work");
  const [sessionCount, setSessionCount] = useState(1);
  const [remainingMs, setRemainingMs] = useState(workMins * 60 * 1000);
  const [running, setRunning] = useState(true); // Start on load

  // Sound/notification toggles
  const [soundOn, setSoundOn] = useState(() =>
    getStoredBool("pomodoro:sound", true),
  );
  const [notifOn, setNotifOn] = useState(() =>
    getStoredBool("pomodoro:notif", true),
  );

  // For accurate interval
  const intervalRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  function checkPlaySound(phase: Phase) {
    if (soundOn) {
      playSound(phase);
    }
  }

  function checkNotify(phase: Phase) {
    if (notifOn) {
      notify(
        PHASE_LABELS[phase],
        `Time for ${PHASE_LABELS[phase].toLowerCase()}!`,
      );
    }
  }

  // Play sound and notify on phase change
  useEffect(() => {
    checkPlaySound(phase);
    checkNotify(phase);
    // eslint-disable-next-line
  }, [phase]);

  // Timer logic
  useEffect(() => {
    if (running && remainingMs > 0) {
      intervalRef.current = window.setInterval(() => {
        const now = Date.now();
        const elapsed = now - lastTickRef.current;
        lastTickRef.current = now;
        setRemainingMs((ms) => Math.max(0, ms - elapsed));
      }, 50);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, remainingMs]);

  // On timer end, advance phase
  useEffect(() => {
    if (remainingMs === 0) {
      setRunning(false);
      setTimeout(() => {
        nextPhase();
      }, 1000);
    }
    // eslint-disable-next-line
  }, [remainingMs]);

  // Reset on config change
  useEffect(() => {
    setPhase("work");
    setSessionCount(1);
    setRemainingMs(workMins * 60 * 1000);
    setRunning(true);
    // eslint-disable-next-line
  }, [workMins, shortMins, longMins, sessionsBeforeLong]);

  function nextPhase() {
    if (phase === "work") {
      if (sessionCount < sessionsBeforeLong) {
        setPhase("short");
        setRemainingMs(shortMins * 60 * 1000);
        setRunning(true);
      } else {
        setPhase("long");
        setRemainingMs(longMins * 60 * 1000);
        setRunning(true);
      }
    } else if (phase === "short") {
      setPhase("work");
      setSessionCount((c) => c + 1);
      setRemainingMs(workMins * 60 * 1000);
      setRunning(true);
    } else if (phase === "long") {
      setPhase("work");
      setSessionCount(1);
      setRemainingMs(workMins * 60 * 1000);
      setRunning(true);
    }
  }

  function resetPhase() {
    if (phase === "work") {
      setRemainingMs(workMins * 60 * 1000);
    } else if (phase === "short") {
      setRemainingMs(shortMins * 60 * 1000);
    } else {
      setRemainingMs(longMins * 60 * 1000);
    }
    setRunning(false);
  }

  // Hotkey controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (
        e.target &&
        ["INPUT", "SELECT", "TEXTAREA"].includes(
          (e.target as HTMLElement).tagName,
        )
      )
        return;
      switch (e.key.toLowerCase()) {
        case " ":
        case "spacebar":
          e.preventDefault();
          if (remainingMs > 0) setRunning((r) => !r);
          break;
        case "r":
          e.preventDefault();
          resetPhase();
          break;
        case "n":
          e.preventDefault();
          nextPhase();
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
    phase,
    workMins,
    shortMins,
    longMins,
    sessionsBeforeLong,
  ]);

  // Breakdown remaining time
  const totalSeconds = Math.floor(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const ms = Math.floor((remainingMs % 1000) / 10);

  return (
    <div
      className={`flex flex-col p-8 bg-slate-900 h-screen w-screen items-center justify-center`}
    >
      <div
        className={`space-y-8 w-full max-w-lg ${PHASE_COLORS[phase]} duration-500 transition-colors rounded-xl p-8 pr-12 shadow-lg border border-neutral-500/50`}
      >
        <div className="font-mono text-white">
          <div className="text-2xl mt-2 tracking-widest">
            {PHASE_LABELS[phase]}
          </div>
          <div className="flex flex-row gap-6 mb-6 mt-4">
            {Array.from({ length: sessionsBeforeLong }).map((_, i) => {
              // color
              const isActive = i === sessionCount - 1;
              const wasActive = i < sessionCount - 1;
              const colorClass = isActive
                ? PHASE_COLORS_SOLID[phase] + " border border-white/30"
                : wasActive
                  ? "bg-white/80"
                  : "bg-white/20";
              return (
                <div
                  key={i}
                  className={`size-4 rounded-full ${colorClass}`}
                ></div>
              );
            })}
          </div>
          <div className="text-5xl font-medium tracking-wider mb-2">
            {numberToWords(minutes)}{" "}
            <span className="text-5xl">
              {(minutes <= 20 || minutes % 10 == 0) && <br />}minute
              {minutes != 1 && "s"}
            </span>
          </div>
          <div className="text-5xl font-light text-white/80 tracking-wider">
            and {numberToWords(seconds)}{" "}
            <span className="text-5xl">
              {(seconds <= 20 || seconds % 10 == 0) && <br />}second
              {seconds != 1 && "s"}
            </span>
          </div>
          <div className="text-xl text-white/60 text-right mt-2">
            <span className="font-mono">
              {(ms * 10).toString().padStart(3, "0")}
            </span>{" "}
            ms
          </div>
        </div>
        <div className="-mt-2 flex w-full justify-end gap-2 flex-wrap">
          {!running && remainingMs > 0 ? (
            <button
              className="p-2 text-white rounded bg-blue-500/25 hover:bg-blue-500/50 duration-150 transition-colors border border-neutral-500/50 cursor-pointer"
              onClick={() => {
                setRunning(true);
                lastTickRef.current = Date.now();
              }}
              disabled={running || remainingMs === 0}
              tabIndex={-1}
            >
              <Play />
            </button>
          ) : (
            <button
              className="p-2 text-white rounded hover:bg-neutral-500/50 duration-150 transition-colors border border-neutral-500/50 cursor-pointer"
              onClick={() => setRunning((r) => !r)}
              disabled={remainingMs === 0}
              tabIndex={-1}
            >
              {running ? <Pause /> : <Play />}
            </button>
          )}
          <button
            className="p-2 text-white rounded hover:bg-neutral-500/50 duration-150 transition-colors border border-neutral-500/50 cursor-pointer"
            onClick={resetPhase}
            tabIndex={-1}
          >
            <RotateCcw />
          </button>
          <button
            className="p-2 text-white rounded hover:bg-neutral-500/50 duration-150 transition-colors border border-neutral-500/50 cursor-pointer"
            onClick={nextPhase}
            tabIndex={-1}
          >
            <ChevronRight />
          </button>
        </div>
        <div className="-mt-6 pb-2 text-xs text-slate-200 font-mono flex w-full justify-end flex-row gap-2">
          <label className="flex items-center text-xs hover:bg-neutral-500/50 has-[:checked]:hover:bg-neutral-800/50 has-[:checked]:bg-neutral-800/30 duration-150 transition-colors border border-neutral-500/50 p-2 rounded cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-0"
              checked={soundOn}
              onChange={(e) => {
                setSoundOn(e.target.checked);
                playSound("work");
                setStoredBool("pomodoro:sound", e.target.checked);
              }}
            />
            <Volume2 />
          </label>
          <label className="flex items-center text-xs hover:bg-neutral-500/50 has-[:checked]:bg-neutral-800/30 duration-150 transition-colors border border-neutral-500/50 p-2 rounded cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-0"
              checked={notifOn}
              onChange={(e) => {
                setNotifOn(e.target.checked);
                setStoredBool("pomodoro:notif", e.target.checked);
              }}
            />
            <Bell />
          </label>
        </div>
      </div>
    </div>
  );
}
