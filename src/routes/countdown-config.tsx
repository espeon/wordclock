import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/countdown-config")({
  component: Configurator,
});

import { useQueryState } from "nuqs";
import { useEffect } from "react";

export function Configurator() {
  const [hoursParam, setHoursParam] = useQueryState("h", {
    defaultValue: "0",
  });
  const [minutesParam, setMinutesParam] = useQueryState("m", {
    defaultValue: "0",
  });
  const [secondsParam, setSecondsParam] = useQueryState("s", {
    defaultValue: "0",
  });
  const [dirParam, setDirParam] = useQueryState("dir", {
    defaultValue: "left",
  });

  // Hotkey controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.target && ["INPUT", "SELECT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) return;
      let h = parseInt(hoursParam || "0", 10);
      let m = parseInt(minutesParam || "0", 10);
      let s = parseInt(secondsParam || "0", 10);
      switch (e.key.toLowerCase()) {
        case "h":
          if (e.shiftKey) {
            h = Math.max(0, h - 1);
          } else {
            h = Math.min(23, h + 1);
          }
          setHoursParam(String(h));
          break;
        case "j":
          if (e.shiftKey) {
            m = Math.max(0, m - 1);
          } else {
            m = Math.min(59, m + 1);
          }
          setMinutesParam(String(m));
          break;
        case "k":
          if (e.shiftKey) {
            s = Math.max(0, s - 1);
          } else {
            s = Math.min(59, s + 1);
          }
          setSecondsParam(String(s));
          break;
        case "l":
          // No-op, reserved for possible future use
          break;
        case "d":
          setDirParam(dirParam === "left" ? "right" : "left");
          break;
        case "g":
          e.preventDefault();
          window.location.href = `/countdown?h=${h}&m=${m}&s=${s}&dir=${dirParam}`;
          break;
        case "enter":
          e.preventDefault();
          window.location.href = `/countdown?h=${h}&m=${m}&s=${s}&dir=${dirParam}`;
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line
  }, [hoursParam, minutesParam, secondsParam, dirParam, setHoursParam, setMinutesParam, setSecondsParam, setDirParam]);

  return (
    <div className="flex flex-col items-start justify-start p-8 bg-slate-900 h-screen w-screen">
      <div className="mb-8">
        <a href="/" className="text-blue-400 underline mr-4">
          Word Clock
        </a>
        <a href="/countdown" className="text-blue-400 underline">
          Countdown
        </a>
      </div>
      <div className="text-white font-mono space-y-6">
        <h2 className="text-3xl mb-4">Countdown Configurator</h2>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            // Go to countdown with params
            window.location.href = `/countdown?h=${hoursParam}&m=${minutesParam}&s=${secondsParam}&dir=${dirParam}`;
          }}
        >
          <div>
            <label className="block mb-1">Hours</label>
            <input
              type="number"
              min={0}
              max={23}
              value={hoursParam}
              onChange={(e) => setHoursParam(e.target.value)}
              className="px-2 py-1 rounded bg-slate-800 text-white w-20"
            />
          </div>
          <div>
            <label className="block mb-1">Minutes</label>
            <input
              type="number"
              min={0}
              max={59}
              value={minutesParam}
              onChange={(e) => setMinutesParam(e.target.value)}
              className="px-2 py-1 rounded bg-slate-800 text-white w-20"
            />
          </div>
          <div>
            <label className="block mb-1">Seconds</label>
            <input
              type="number"
              min={0}
              max={59}
              value={secondsParam}
              onChange={(e) => setSecondsParam(e.target.value)}
              className="px-2 py-1 rounded bg-slate-800 text-white w-20"
            />
          </div>
          <div>
            <label className="block mb-1">Direction</label>
            <select
              value={dirParam}
              onChange={(e) => setDirParam(e.target.value)}
              className="px-2 py-1 rounded bg-slate-800 text-white w-32"
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
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
            <li><b>H</b>: +1 hour, <b>Shift+H</b>: -1 hour</li>
            <li><b>J</b>: +1 minute, <b>Shift+J</b>: -1 minute</li>
            <li><b>K</b>: +1 second, <b>Shift+K</b>: -1 second</li>
            <li><b>D</b>: Toggle Direction</li>
            <li><b>G</b> or <b>Enter</b>: Go to Countdown</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
