import "./SignalField.css";

const NODES = [
  { x: "14%", delay: "0s" },
  { x: "46%", delay: "1.6s" },
  { x: "78%", delay: "3.1s" },
];

/**
 * Ambient animated backdrop — the product's signature visual motif:
 * voice → understanding → action, expressed as drifting signal lines
 * with occasional pulsing nodes. Decorative only.
 */
function SignalField({ className = "" }) {
  return (
    <div className={`signal-field ${className}`} aria-hidden="true">
      <svg className="signal-field__wave signal-field__wave--a" viewBox="0 0 1600 220" preserveAspectRatio="none">
        <path d="M0,110 C 40,70 80,150 120,110 C 160,70 200,150 240,110 C 280,70 320,150 360,110 C 400,70 440,150 480,110 C 520,70 560,150 600,110 C 640,70 680,150 720,110 C 760,70 800,150 840,110 C 880,70 920,150 960,110 C 1000,70 1040,150 1080,110 C 1120,70 1160,150 1200,110 C 1240,70 1280,150 1320,110 C 1360,70 1400,150 1440,110 C 1480,70 1520,150 1560,110 C 1600,70 1600,110 1600,110" />
      </svg>
      <svg className="signal-field__wave signal-field__wave--b" viewBox="0 0 1600 220" preserveAspectRatio="none">
        <path d="M0,110 C 60,150 120,70 180,110 C 240,150 300,70 360,110 C 420,150 480,70 540,110 C 600,150 660,70 720,110 C 780,150 840,70 900,110 C 960,150 1020,70 1080,110 C 1140,150 1200,70 1260,110 C 1320,150 1380,70 1440,110 C 1500,150 1560,70 1600,110" />
      </svg>
      <svg className="signal-field__wave signal-field__wave--c" viewBox="0 0 1600 220" preserveAspectRatio="none">
        <path d="M0,110 C 30,90 60,130 90,110 C 120,90 150,130 180,110 C 210,90 240,130 270,110 C 300,90 330,130 360,110 C 390,90 420,130 450,110 C 480,90 510,130 540,110 C 570,90 600,130 630,110 C 660,90 690,130 720,110 C 750,90 780,130 810,110 C 840,90 870,130 900,110 C 930,90 960,130 990,110 C 1020,90 1050,130 1080,110 C 1110,90 1140,130 1170,110 C 1200,90 1230,130 1260,110 C 1290,90 1320,130 1350,110 C 1380,90 1410,130 1440,110 C 1470,90 1500,130 1530,110 C 1560,90 1600,130 1600,110" />
      </svg>

      {NODES.map((node) => (
        <span
          key={node.x}
          className="signal-field__node"
          style={{ "--x": node.x, "--delay": node.delay }}
        />
      ))}
    </div>
  );
}

export default SignalField;