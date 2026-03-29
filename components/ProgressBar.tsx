"use client"

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null); 

  useEffect(() => {
    setProgress(100);
    timer.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 400);

    return () => {
      if (timer.current) clearTimeout(timer.current); 
    };
  }, [pathname, searchParams]);

  const startProgress = () => {
    setVisible(true);
    setProgress(0);
    let p = 0;
    timer.current = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 90) {
        if (timer.current) clearInterval(timer.current);
        p = 90;
      }
      setProgress(p);
    }, 200);
  };

  return (
    <>
      {visible && (
        <div
          className="fixed top-0 left-0 z-[9999] h-[3px] rounded-r-sm shadow-[0_0_8px_#6366f1] bg-indigo-500 transition-[width] duration-200 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      )}
    </>
  );
}