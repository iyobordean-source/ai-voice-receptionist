import { useEffect, useState } from "react";
import "./CallPreview.css";

const HERO_WAVEFORM = [
  18, 34, 62, 28, 82, 46, 24, 70,
  38, 58, 20, 48, 76, 32, 56, 25,
  44, 68, 30, 52, 22, 42, 64, 34,
];

const SHOWCASE_WAVEFORM = [
  20, 40, 64, 30, 82, 46, 26, 72,
  38, 58, 24, 48, 76, 32, 60, 22,
  44, 68, 28, 54,
];

const HERO_STATES = [
  "Listening",
  "Understanding",
  "Speaking",
];

const SHOWCASE_LINES = [
  {
    from: "customer",
    text: "I want two plates of jollof rice and one chicken.",
  },
  {
    from: "ai",
    text: "Two jollof rice and one chicken. Anything to drink?",
  },
  {
    from: "customer",
    text: "No, that's all.",
  },
  {
    from: "ai",
    text: "Perfect. Your order is in.",
  },
];

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}

function CallPreview({ variant = "hero" }) {
  const isShowcase = variant === "showcase";
  const waveform = isShowcase
    ? SHOWCASE_WAVEFORM
    : HERO_WAVEFORM;

  const [seconds, setSeconds] = useState(
    isShowcase ? 38 : 6
  );

  useEffect(() => {
    if (isShowcase) return undefined;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return undefined;

    const interval = window.setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isShowcase]);

  return (
    <div
      className={`call-preview call-preview--${variant}`}
      aria-label={
        isShowcase
          ? "Example conversation between a customer and the AI receptionist"
          : "AI receptionist handling an active call"
      }
    >
      <div className="call-preview__ambient" />

      <div className="call-preview__header">
        <div className="call-preview__identity">
          <span className="call-preview__live-dot" />

          <div>
            <span className="call-preview__eyebrow">
              {isShowcase ? "Example conversation" : "Incoming call"}
            </span>

            <strong>
              {isShowcase ? "Order Kitchen" : "AI Receptionist"}
            </strong>
          </div>
        </div>

        <span className="call-preview__timer">
          {formatDuration(seconds)}
        </span>
      </div>

      <div className="call-preview__signal">
        <div className="call-preview__signal-core">
          <span />
          <span />
          <span />
        </div>

        <div className="call-preview__wave">
          {waveform.map((height, index) => (
            <span
              key={index}
              style={{
                "--height": `${height}%`,
                "--delay": `${index * 0.045}s`,
              }}
            />
          ))}
        </div>
      </div>

      {!isShowcase && (
        <div className="call-preview__states">
          {HERO_STATES.map((state, index) => (
            <span
              key={state}
              className={
                index === 0
                  ? "call-preview__state call-preview__state--active"
                  : "call-preview__state"
              }
            >
              {state}
            </span>
          ))}
        </div>
      )}

      {isShowcase ? (
        <div className="call-preview__conversation">
          {SHOWCASE_LINES.map((line, index) => (
            <div
              className={`call-preview__message call-preview__message--${line.from}`}
              key={`${line.from}-${index}`}
              style={{
                "--delay": `${index * 0.35}s`,
              }}
            >
              <span>
                {line.from === "customer" ? "Customer" : "AI"}
              </span>

              <p>{line.text}</p>
            </div>
          ))}

          <div className="call-preview__success">
            <span className="call-preview__success-icon">✓</span>
            <span>Action ready</span>
          </div>
        </div>
      ) : (
        <div className="call-preview__live-copy">
          <span>Live conversation</span>

          <p>
            “Do you have a table for two tonight?”
          </p>
        </div>
      )}

      <div className="call-preview__footer">
        <span>VOICE</span>
        <i />
        <span>REAL-TIME</span>
        <i />
        <span>ACTION</span>
      </div>
    </div>
  );
}

export default CallPreview;