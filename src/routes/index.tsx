import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});
import { useState, useEffect } from "react";
import { numberToWords } from "../numberToWords";
import { useQueryState } from "nuqs";

export default function App() {
  const [time, setTime] = useState(new Date());

  const [dirParam] = useQueryState("dir", {
    defaultValue: "left",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1); // Update every millisecond

    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();

  const hoursWord = numberToWords(hours);
  const minutesWord = numberToWords(minutes);
  const secondsWord = numberToWords(seconds);
  const millisecondsWord = numberToWords(milliseconds);

  const alignClass =
    dirParam === "right" ? "items-end text-end" : "items-start text-start";

  return (
    <div
      className={`flex flex-col ${alignClass} p-8 bg-slate-900 h-screen w-screen`}
    >
      <div className="space-y-6 font-mono">
        <div className="group">
          <div className="text-4xl md:text-5xl font-light text-white tracking-wider">
            {hoursWord}
          </div>
        </div>
        <div className="group">
          <div className="text-4xl md:text-5xl font-light text-white tracking-wider">
            {minutesWord}
          </div>
        </div>
        <div className="group">
          <div className="text-4xl md:text-5xl font-light text-white tracking-wider">
            {secondsWord}
          </div>
        </div>
        <div className="group">
          <div className="text-xl font-light text-white/80 tracking-wider">
            and {millisecondsWord}
          </div>
        </div>
      </div>
    </div>
  );
}
