// Self-contained reveal-on-scroll wrapper.
//
// WHY a component instead of the main site's imperative ".reveal -> .in" observer:
// JourneyApp re-renders on every scroll (activeIndex changes), so React re-applies
// each node's className and would WIPE an imperatively-added `.in`, leaving the
// node stuck at opacity:0 forever (the observer had already unobserved it). Here
// `shown` is local React state, so React itself owns the `in` class and never
// drops it across the parent's re-renders.

import { useEffect, useRef, useState } from "react";
import type { ElementType, ReactNode } from "react";

export function Reveal({
  as,
  className = "",
  children,
  ...rest
}: {
  as?: ElementType;
  className?: string;
  children?: ReactNode;
  [key: string]: unknown;
}) {
  const Tag = (as || "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (shown) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);

  return (
    <Tag ref={ref as never} className={`reveal ${shown ? "in" : ""} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
