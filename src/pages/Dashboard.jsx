import { useCallback, useEffect, useRef, useState } from "react";
import VapiModule from "@vapi-ai/web";
import { supabase } from "../lib/supabase";
import "./Dashboard.css";

const vapiPublicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
const vapiAssistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;

const transcript = [
  {
    speaker: "Customer",
    text: "I want two plates of jollof rice and one chicken.",
  },
  {
    speaker: "AI",
    text: "Two jollof rice and one chicken. Anything to drink?",
  },
  {
    speaker: "Customer",
    text: "No, that's all.",
  },
  {
    speaker: "AI",
    text: "Perfect. Your order is in.",
  },
];

const waveform = [
  18, 35, 58, 28, 72, 44, 25, 64, 42,
  78, 34, 56, 24, 68, 40, 60, 30,
];

function getOrderCustomer(order) {
  return Array.isArray(order.customers)
    ? order.customers[0]
    : order.customers;
}

function formatOrderItems(items = []) {
  return items
    .map(({ item_name, quantity }) => `${quantity}× ${item_name}`)
    .join(" · ");
}

function formatOrderTime(createdAt) {
  if (!createdAt) return "";

  const date = new Date(createdAt);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function Dashboard() {
  const [callStatus, setCallStatus] = useState("idle");
  const [callError, setCallError] = useState("");
  const [activeSection, setActiveSection] = useState("Overview");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const vapiRef = useRef(null);
  const callStatusRef = useRef("idle");
  const ordersRequestRef = useRef(0);

  const updateCallStatus = useCallback((status, errorMessage = "") => {
    callStatusRef.current = status;
    setCallStatus(status);
    setCallError(errorMessage);
  }, []);

  const refreshOrders = useCallback(async () => {
    const requestId = ++ordersRequestRef.current;
    setOrdersLoading(true);
    setOrdersError("");

    try {
      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, status, created_at, customers(name, phone), order_items(item_name, quantity)"
        )
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      if (requestId === ordersRequestRef.current) setOrders(data ?? []);
    } catch (error) {
      if (requestId === ordersRequestRef.current) {
        setOrdersError(error?.message || "Could not load orders.");
      }
    } finally {
      if (requestId === ordersRequestRef.current) setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshOrders();
    return () => {
      ordersRequestRef.current += 1;
    };
  }, [refreshOrders]);

  useEffect(() => {
    if (!vapiPublicKey) return undefined;

    const Vapi = VapiModule.default;
    const vapi = new Vapi(vapiPublicKey);
    vapiRef.current = vapi;

    const handleCallStart = () => updateCallStatus("active");
    const handleCallEnd = () => {
      updateCallStatus("ended");
      void refreshOrders();
    };
    const handleCallError = () =>
      updateCallStatus(
        "error",
        "Call failed. Check microphone access and Vapi setup."
      );

    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);
    vapi.on("call-start-failed", handleCallError);
    vapi.on("error", handleCallError);

    return () => {
      vapi.removeListener("call-start", handleCallStart);
      vapi.removeListener("call-end", handleCallEnd);
      vapi.removeListener("call-start-failed", handleCallError);
      vapi.removeListener("error", handleCallError);

      if (vapiRef.current === vapi) vapiRef.current = null;
      void vapi.stop().catch(() => {});
    };
  }, [refreshOrders, updateCallStatus]);

  const latestOrder = orders[0];
  const latestOrderCustomer = latestOrder
    ? getOrderCustomer(latestOrder)
    : null;
  const recentActivity = orders.map((order) => {
    const customer = getOrderCustomer(order);
    const items = Array.isArray(order.order_items) ? order.order_items : [];
    const orderSummary = formatOrderItems(items);

    return {
      id: order.id,
      time: formatOrderTime(order.created_at),
      type: "Order created",
      detail: [customer?.name || "Unknown customer", orderSummary]
        .filter(Boolean)
        .join(" · "),
    };
  });

  const handleTalk = async () => {
    const vapi = vapiRef.current;

    if (callStatusRef.current === "connecting") return;

    if (callStatusRef.current === "active") {
      if (!vapi) return;

      try {
        await vapi.stop();
        if (vapiRef.current === vapi && callStatusRef.current === "active") {
          updateCallStatus("ended");
        }
      } catch {
        if (vapiRef.current === vapi) {
          updateCallStatus("error", "Could not end the call. Please try again.");
        }
      }

      return;
    }

    if (!vapiPublicKey || !vapiAssistantId || !vapi) {
      updateCallStatus(
        "error",
        "Set VITE_VAPI_PUBLIC_KEY and VITE_VAPI_ASSISTANT_ID in .env.local, then restart the dev server."
      );
      return;
    }

    updateCallStatus("connecting");

    try {
      const call = await vapi.start(vapiAssistantId);

      if (vapiRef.current !== vapi) return;
      if (!call && callStatusRef.current === "connecting") {
        updateCallStatus("error", "Vapi could not start the call.");
      }
    } catch {
      if (vapiRef.current === vapi) {
        updateCallStatus(
          "error",
          "Call failed. Check microphone access and Vapi setup."
        );
      }
    }
  };

  const isListening = callStatus === "active";
  const isConnecting = callStatus === "connecting";
  const callStatusLabel = {
    idle: "Ready to handle calls",
    connecting: "Connecting...",
    active: "Listening...",
    ended: "Call ended",
    error: "Connection error",
  }[callStatus];
  const callStatusMessage = {
    idle: "Talk to your AI receptionist",
    connecting: "Connecting to your AI receptionist",
    active: "Listening for your request",
    ended: "Call ended. Tap to start again.",
    error: callError || "Call failed. Check Vapi setup or microphone access.",
  }[callStatus];
  const callStatusHint = {
    idle: "TAP TO TALK",
    connecting: "CONNECTING",
    active: "TAP TO END",
    ended: "TAP TO RESTART",
    error: "TAP TO RETRY",
  }[callStatus];
  const callStatusTime = {
    idle: "READY",
    connecting: "CONNECTING",
    active: "LIVE",
    ended: "ENDED",
    error: "ERROR",
  }[callStatus];

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div className="dashboard__brand">
          <a href="/" className="dashboard__brand-name">
            AI Voice Receptionist
          </a>

          <span className="dashboard__brand-divider" />

          <span className="dashboard__business">
            Order Kitchen
          </span>
        </div>

        <nav className="dashboard__nav">
          {["Overview", "Conversations", "Customers", "Actions"].map(
            (item) => (
              <button
                key={item}
                className={
                  activeSection === item
                    ? "dashboard__nav-item is-active"
                    : "dashboard__nav-item"
                }
                onClick={() => setActiveSection(item)}
              >
                {item}
              </button>
            )
          )}
        </nav>

        <div className="dashboard__header-status">
          <span className="dashboard__status-dot" />
          <span>AI Online</span>
        </div>
      </header>

      <main className="dashboard__main">
        <section className="dashboard__intro">
          <div>
            <span className="dashboard__eyebrow">
              RECEPTIONIST CONTROL CENTER
            </span>

            <h1>
              Your AI is
              <br />
              <span>ready.</span>
            </h1>
          </div>

          <div className="dashboard__intro-meta">
            <span>MONITORING</span>
            <strong>24 / 7</strong>
          </div>
        </section>

        <section className="dashboard__voice">
          <div className="dashboard__voice-top">
            <div>
              <span className="dashboard__section-label">
                AI RECEPTIONIST
              </span>

              <div className="dashboard__ai-state">
                <span
                  className={
                    isListening
                      ? "dashboard__state-dot is-listening"
                      : "dashboard__state-dot"
                  }
                />

                <span>
                  {callStatusLabel}
                </span>
              </div>
            </div>

            <span className="dashboard__voice-time">
              {callStatusTime}
            </span>
          </div>

          <div
            className={
              isListening
                ? "dashboard__voice-core is-active"
                : "dashboard__voice-core"
            }
          >
            <div className="dashboard__voice-ring dashboard__voice-ring--one" />
            <div className="dashboard__voice-ring dashboard__voice-ring--two" />

            <div className="dashboard__voice-center">
              <div className="dashboard__waveform">
                {waveform.map((height, index) => (
                  <span
                    key={index}
                    style={{
                      "--wave-height": `${height}%`,
                      "--wave-delay": `${index * 0.045}s`,
                    }}
                  />
                ))}
              </div>

              <button
                className="dashboard__talk-button"
                type="button"
                onClick={handleTalk}
                disabled={isConnecting}
                aria-busy={isConnecting}
                aria-label={
                  isListening
                    ? "End Vapi call"
                    : isConnecting
                      ? "Connecting to Vapi"
                    : "Talk to AI receptionist"
                }
              >
                <span className="dashboard__talk-icon">
                  {isListening ? "■" : "●"}
                </span>
              </button>
            </div>
          </div>

          <div className="dashboard__voice-bottom">
            <span>
              {callStatusMessage}
            </span>

            <span className="dashboard__voice-hint">
              {callStatusHint}
            </span>
          </div>
        </section>

        <section className="dashboard__grid">
          <div className="dashboard__panel dashboard__panel--conversation">
            <div className="dashboard__panel-header">
              <div>
                <span className="dashboard__section-label">
                  LIVE CONVERSATION
                </span>

                <h2>What your AI is hearing</h2>
              </div>

              <span className="dashboard__live-label">
                <i />
                LIVE
              </span>
            </div>

            <div className="dashboard__transcript">
              {transcript.map((line, index) => (
                <div
                  className="dashboard__transcript-line"
                  key={index}
                >
                  <span
                    className={
                      line.speaker === "AI"
                        ? "dashboard__speaker dashboard__speaker--ai"
                        : "dashboard__speaker"
                    }
                  >
                    {line.speaker}
                  </span>

                  <p>{line.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard__panel dashboard__panel--understood">
            <div className="dashboard__panel-header">
              <div>
                <span className="dashboard__section-label">
                  UNDERSTOOD
                </span>

                <h2>Customer intent</h2>
              </div>

              <span className="dashboard__confidence">
                HIGH
              </span>
            </div>

            <div className="dashboard__intent">
              <span className="dashboard__intent-label">
                ORDER
              </span>

              <h3>Place food order</h3>

              <div className="dashboard__items">
                <div>
                  <span>02 ×</span>
                  <strong>Jollof Rice</strong>
                </div>

                <div>
                  <span>01 ×</span>
                  <strong>Chicken</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard__action">
          <div className="dashboard__action-main">
            <div className="dashboard__action-heading">
              <span className="dashboard__section-label">
                ACTION
              </span>

              <span className="dashboard__action-status">
                <i />
                {ordersLoading
                  ? "LOADING"
                  : ordersError
                    ? "UNAVAILABLE"
                    : latestOrder?.status?.toUpperCase() || "NO ORDERS"}
              </span>
            </div>

            <h2>
              Create
              <br />
              <span>Order</span>
            </h2>

            <p>
              The AI converted the conversation into a
              real business action.
            </p>
          </div>

          <div className="dashboard__action-result">
            <div className="dashboard__result-top">
              <span>
                {ordersLoading
                  ? "LOADING ORDERS"
                  : ordersError
                    ? "ORDERS UNAVAILABLE"
                    : latestOrder
                      ? "ORDER CREATED"
                      : "NO ORDERS"}
              </span>
              <span>{latestOrder ? formatOrderTime(latestOrder.created_at) : ""}</span>
            </div>

            <div className="dashboard__result-items">
              {ordersLoading ? (
                <div>
                  <strong>Loading recent orders…</strong>
                </div>
              ) : ordersError ? (
                <div>
                  <strong>Could not load orders: {ordersError}</strong>
                </div>
              ) : latestOrder ? (
                (latestOrder.order_items ?? []).map((item, index) => (
                  <div key={`${latestOrder.id}-${index}`}>
                    <span>{String(item.quantity).padStart(2, "0")}</span>
                    <strong>{item.item_name}</strong>
                  </div>
                ))
              ) : (
                <div>
                  <strong>No orders yet.</strong>
                </div>
              )}
            </div>

            <div className="dashboard__result-customer">
              <span>CUSTOMER</span>
              <strong>
                {ordersLoading
                  ? "Loading…"
                  : latestOrderCustomer?.name || (latestOrder ? "Unknown customer" : "—")}
              </strong>
            </div>
          </div>
        </section>

        <section className="dashboard__bottom-grid">
          <div className="dashboard__panel">
            <div className="dashboard__panel-header">
              <div>
                <span className="dashboard__section-label">
                  RECENT ACTIVITY
                </span>

                <h2>What your AI has done</h2>
              </div>
            </div>

            <div className="dashboard__activity">
              {ordersLoading ? (
                <div className="dashboard__activity-item">
                  <span className="dashboard__activity-time">…</span>
                  <div>
                    <strong>Loading recent orders</strong>
                    <span>Please wait.</span>
                  </div>
                </div>
              ) : ordersError ? (
                <div className="dashboard__activity-item">
                  <span className="dashboard__activity-time">ERROR</span>
                  <div>
                    <strong>Could not load orders</strong>
                    <span>{ordersError}</span>
                  </div>
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="dashboard__activity-item">
                  <span className="dashboard__activity-time">—</span>
                  <div>
                    <strong>No orders yet</strong>
                    <span>New orders will appear here.</span>
                  </div>
                </div>
              ) : recentActivity.map((item) => (
                <div
                  className="dashboard__activity-item"
                  key={item.id}
                >
                  <span className="dashboard__activity-time">
                    {item.time}
                  </span>

                  <div>
                    <strong>{item.type}</strong>
                    <span>{item.detail}</span>
                  </div>

                  <span className="dashboard__activity-check">
                    ✓
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard__panel dashboard__quick-panel">
            <span className="dashboard__section-label">
              RECEPTIONIST
            </span>

            <h2>
              Your business
              <br />
              never goes quiet.
            </h2>

            <p>
              Calls, questions, orders and appointments
              handled automatically.
            </p>

            <div className="dashboard__quick-status">
              <span className="dashboard__status-dot" />
              AI receptionist online
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
