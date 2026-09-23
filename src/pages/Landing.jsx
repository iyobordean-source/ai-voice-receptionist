import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import CallPreview from "../components/CallPreview.jsx";
import OrderFlow from "../components/OrderFlow.jsx";
import "./Landing.css";

const PROBLEMS = [
  "Calls go unanswered after hours.",
  "The same questions get asked all day.",
  "Orders and requests get missed between conversations.",
  "Appointment requests sit until someone has time.",
  "Customers wait for replies that should be instant.",
];

const KNOWLEDGE_ITEMS = [
  "Services",
  "Menu & pricing",
  "Opening hours",
  "Location",
  "Policies",
  "FAQs",
];

const CAPABILITIES = [
  {
    title: "Orders",
    description:
      "Takes complete orders through conversation and sends them into your system.",
  },
  {
    title: "Appointments",
    description:
      "Books, reschedules and confirms appointments without the back-and-forth.",
  },
  {
    title: "Customer capture",
    description:
      "Collects names, numbers and useful details while the conversation happens.",
  },
  {
    title: "Enquiries",
    description:
      "Answers common questions using the information you provide.",
  },
  {
    title: "Follow-ups",
    description:
      "Keeps track of requests that need another touch from the business.",
  },
];

function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => {
        element.classList.add("is-visible");
      });

      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -80px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);
}

function useScrollProgress() {
  const progressRef = useRef(null);

  useEffect(() => {
    const element = progressRef.current;

    if (!element) return;

    let ticking = false;

    const update = () => {
      const scrollTop = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress =
        maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;

      element.style.transform = `scaleX(${progress})`;

      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;

      window.requestAnimationFrame(update);
      ticking = true;
    };

    update();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return progressRef;
}

function AmbientField() {
  return (
    <div className="ambient-field" aria-hidden="true">
      <div className="ambient-field__noise" />

      <div className="ambient-field__grid ambient-field__grid--horizontal" />
      <div className="ambient-field__grid ambient-field__grid--vertical" />

      <div className="ambient-field__ring ambient-field__ring--one" />
      <div className="ambient-field__ring ambient-field__ring--two" />
      <div className="ambient-field__ring ambient-field__ring--three" />

      <div className="ambient-field__signal ambient-field__signal--one" />
      <div className="ambient-field__signal ambient-field__signal--two" />

      <span className="ambient-field__node ambient-field__node--one" />
      <span className="ambient-field__node ambient-field__node--two" />
      <span className="ambient-field__node ambient-field__node--three" />
      <span className="ambient-field__node ambient-field__node--four" />
    </div>
  );
}

function HeroOrb() {
  return (
    <div className="hero-orb" aria-hidden="true">
      <div className="hero-orb__outer" />
      <div className="hero-orb__middle" />
      <div className="hero-orb__inner" />

      <div className="hero-orb__core">
        <span className="hero-orb__core-line hero-orb__core-line--one" />
        <span className="hero-orb__core-line hero-orb__core-line--two" />
        <span className="hero-orb__core-line hero-orb__core-line--three" />
      </div>

      <div className="hero-orb__scan" />
    </div>
  );
}

function Landing() {
  useReveal();

  const progressRef = useScrollProgress();

  return (
    <div className="landing">
      <div className="landing__progress" ref={progressRef} />

      <Navbar />

      <main>
        {/* =========================================================
            HERO
        ========================================================== */}

        <section className="hero">
          <AmbientField />

          <div className="hero__glow" aria-hidden="true" />

          <div className="container hero__inner">
            <div className="hero__copy">
              <p className="eyebrow hero__eyebrow">
                <span className="eyebrow__signal" />
                AI Voice Receptionist
              </p>

              <h1 className="hero__title">
                Your business has a receptionist that{" "}
                <span>never sleeps.</span>
              </h1>

              <p className="hero__subtitle">
                It answers customers naturally, understands what they need,
                and gets real work done — even when nobody is there to pick up
                the phone.
              </p>

              <div className="hero__actions">
                <Link to="/dashboard" className="cta-button">
                  Get started
                </Link>

                <a href="#how-it-works" className="hero__secondary">
                  See how it works
                  <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>

            <div className="hero__visual">
              <HeroOrb />

              <div className="hero__call">
                <CallPreview variant="hero" />
              </div>

              <div className="hero__visual-label hero__visual-label--top">
                <span />
                Live voice signal
              </div>

              <div className="hero__visual-label hero__visual-label--bottom">
                <span />
                Understanding
              </div>
            </div>
          </div>

          <div className="hero__bottom">
            <span>VOICE</span>
            <i />
            <span>UNDERSTANDING</span>
            <i />
            <span>ACTION</span>
          </div>
        </section>

        {/* =========================================================
            PROBLEM
        ========================================================== */}

        <section className="problem" data-reveal>
          <div className="container problem__inner">
            <div className="section-number">01</div>

            <div className="problem__content">
              <p className="eyebrow">The problem</p>

              <h2 className="problem__statement">
                Every business answers the phone.
                <span> Not every business answers it well.</span>
              </h2>

              <div className="problem__list">
                {PROBLEMS.map((problem, index) => (
                  <div className="problem__item" key={problem}>
                    <span className="problem__index">
                      0{index + 1}
                    </span>

                    <span className="problem__dot" />

                    <p>{problem}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            RECEPTIONIST
        ========================================================== */}

        <section
          id="how-it-works"
          className="receptionist"
          data-reveal
        >
          <AmbientField />

          <div className="container receptionist__inner">
            <div className="receptionist__copy">
              <div className="section-number">02</div>

              <p className="eyebrow">The receptionist</p>

              <h2 className="receptionist__title">
                A conversation,
                <span> not a menu of button presses.</span>
              </h2>

              <p className="receptionist__text">
                Customers speak naturally. The receptionist listens,
                understands what is actually being asked, and responds like a
                person.
              </p>

              <div className="receptionist__states">
                <span>Listening</span>
                <span>Thinking</span>
                <span>Speaking</span>
              </div>
            </div>

            <div className="receptionist__stage">
              <CallPreview variant="showcase" />
            </div>
          </div>
        </section>

        {/* =========================================================
            ACTION
        ========================================================== */}

        <section className="action" data-reveal>
          <div className="container action__inner">
            <div className="section-number">03</div>

            <p className="eyebrow">It doesn't just talk</p>

            <h2 className="action__title">
              The call ends.
              <span> The work is already done.</span>
            </h2>

            <p className="action__intro">
              The important part isn't that the AI can speak. It's that the
              conversation can become something useful for the business.
            </p>

            <OrderFlow />
          </div>
        </section>

        {/* =========================================================
            KNOWLEDGE
        ========================================================== */}

        <section className="knowledge" data-reveal>
          <div className="container knowledge__inner">
            <div className="section-number">04</div>

            <p className="eyebrow">Your business knowledge</p>

            <h2 className="knowledge__title">
              It speaks for
              <span> your business.</span>
            </h2>

            <p className="knowledge__text">
              Give it the information your customers actually need — services,
              pricing, hours, policies and frequently asked questions.
            </p>
          </div>

          <div className="knowledge__marquee" aria-hidden="true">
            <div className="knowledge__track">
              {[...KNOWLEDGE_ITEMS, ...KNOWLEDGE_ITEMS].map(
                (item, index) => (
                  <span key={`${item}-${index}`}>
                    {item}
                    <i />
                  </span>
                )
              )}
            </div>
          </div>
        </section>

        {/* =========================================================
            CAPABILITIES
        ========================================================== */}

        <section
          id="capabilities"
          className="capabilities"
          data-reveal
        >
          <div className="container">
            <div className="section-number">05</div>

            <p className="eyebrow">More than calls</p>

            <h2 className="capabilities__title">
              One receptionist.
              <span> Several jobs.</span>
            </h2>

            <div className="capabilities__list">
              {CAPABILITIES.map((item, index) => (
                <div className="capability" key={item.title}>
                  <span className="capability__number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="capability__main">
                    <h3>{item.title}</h3>

                    <p>{item.description}</p>
                  </div>

                  <span className="capability__arrow">↗</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            FINAL
        ========================================================== */}

        <section className="final" data-reveal>
          <AmbientField />

          <div className="container final__inner">
            <div className="final__orb" aria-hidden="true">
              <div />
              <div />
              <div />
            </div>

            <p className="eyebrow">Always on</p>

            <h2 className="final__title">
              Give your business
              <span> a voice that's always on.</span>
            </h2>

            <Link to="/dashboard" className="cta-button">
              Get started
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Landing;
