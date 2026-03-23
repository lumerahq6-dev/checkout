"use client";

import { useEffect, useState } from "react";

const announcements = [
  "NEW KAIMATSU PLUGIN UPDATE — V2.0 OUT NOW",
  "30% OFF ANNUAL SUBSCRIPTIONS — LIMITED TIME",
  "JOIN THE DISCORD FOR PRIVATE COACHING & EARLY ACCESS",
];

export default function AnnouncementBar() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % announcements.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-accent overflow-hidden">
      <div className="py-2.5 px-4 text-center">
        <p className="text-xs font-semibold tracking-[0.15em] uppercase text-white transition-opacity duration-500">
          {announcements[current]}
        </p>
      </div>
    </div>
  );
}
