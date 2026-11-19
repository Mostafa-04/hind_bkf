import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

const hiddenState = {
  up: "translate-y-10",
  left: "-translate-x-10",
  right: "translate-x-10",
  none: "",
};

export default function Reveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
}) {
  const [ref, inView] = useInView();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
        inView
          ? "translate-x-0 translate-y-0 opacity-100"
          : `opacity-0 ${hiddenState[direction]}`
      } ${className}`}
    >
      {children}
    </div>
  );
}