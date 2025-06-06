import { createFileRoute } from "@tanstack/react-router";
import { useQueryState } from "nuqs";
import { useEffect } from "react";

export const Route = createFileRoute("/pomodoro-config")({
  component: PomodoroConfigurator,
});

const DEFAULTS = {
  work: 25,
  short: 5,
  long: 15,
  sessions: 4,
};

export default function PomodoroConfigurator() {
  const [work, setWork] = useQueryState("work", {
    defaultValue: String(DEFAULTS.work),
  });
  const [short, setShort] = useQueryState("short", {
    defaultValue: String(DEFAULTS.short),
  });
  const [long, setLong] = useQueryState("long", {
    defaultValue: String(DEFAULTS.long),
  });
  const [sessions, setSessions] = useQueryState("sessions", {
    defaultValue: String(DEFAULTS.sessions),
  });

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
      let w = parseInt(work || "25", 10);
      let s = parseInt(short || "5", 10);
      let l = parseInt(long || "15", 10);
      let sess = parseInt(sessions || "4", 10);
      switch (e.key.toLowerCase()) {
        case "w":
          if (e.shiftKey) w = Math.max(1, w - 1);
          else w = Math.min(120, w + 1);
          setWork(String(w));
          break;
        case "s":
          if (e.shiftKey) s = Math.max(1, s - 1);
          else s = Math.min(60, s + 1);
          setShort(String(s));
          break;
        case "l":
          if (e.shiftKey) l = Math.max(1, l - 1);
          else l = Math.min(60, l + 1);
          setLong(String(l));
          break;
        case "n":
          if (e.shiftKey) sess = Math.max(1, sess - 1);
          else sess = Math.min(12, sess + 1);
          setSessions(String(sess));
          break;
        case "g":
        case "enter":
          e.preventDefault();
          window.location.href = `/pomodoro?work=${w}&short=${s}&long=${l}&sessions=${sess}`;
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line
  }, [work, short, long, sessions, setWork, setShort, setLong, setSessions]);

  return (
    <div className="flex flex-col items-start justify-start p-8 bg-slate-900 h-screen w-screen">
      <div className="mb-8">
        <a href="/" className="text-blue-400 underline mr-4">
          Word Clock
        </a>
        <a href="/pomodoro" className="text-blue-400 underline">
          Pomodoro
        </a>
      </div>
      <div className="text-white font-mono space-y-6 w-full max-w-md">
        <h2 className="text-3xl mb-4">Pomodoro Configurator</h2>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            window.location.href = `/pomodoro?work=${work}&short=${short}&long=${long}&sessions=${sessions}`;
          }}
        >
          <div>
            <label className="block mb-1">Work Duration (minutes)</label>
            <input
              type="number"
              min={1}
              max={120}
              value={work}
              onChange={(e) => setWork(e.target.value)}
              className="px-2 py-1 rounded bg-slate-800 text-white w-24"
            />
          </div>
          <div>
            <label className="block mb-1">Short Break (minutes)</label>
            <input
              type="number"
              min={1}
              max={60}
              value={short}
              onChange={(e) => setShort(e.target.value)}
              className="px-2 py-1 rounded bg-slate-800 text-white w-24"
            />
          </div>
          <div>
            <label className="block mb-1">Long Break (minutes)</label>
            <input
              type="number"
              min={1}
              max={60}
              value={long}
              onChange={(e) => setLong(e.target.value)}
              className="px-2 py-1 rounded bg-slate-800 text-white w-24"
            />
          </div>
          <div>
            <label className="block mb-1">Sessions Before Long Break</label>
            <input
              type="number"
              min={1}
              max={12}
              value={sessions}
              onChange={(e) => setSessions(e.target.value)}
              className="px-2 py-1 rounded bg-slate-800 text-white w-24"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Go!
          </button>
        </form>
        <div className="mt-6 text-xs text-slate-400 font-mono">
          <div>Hotkeys:</div>
          <ul className="list-disc ml-5">
            <li>
              <b>W</b>: +1 work min, <b>Shift+W</b>: -1 work min
            </li>
            <li>
              <b>S</b>: +1 short break min, <b>Shift+S</b>: -1 short break min
            </li>
            <li>
              <b>L</b>: +1 long break min, <b>Shift+L</b>: -1 long break min
            </li>
            <li>
              <b>N</b>: +1 session, <b>Shift+N</b>: -1 session
            </li>
            <li>
              <b>G</b> or <b>Enter</b>: Go to Pomodoro
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
