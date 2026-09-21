import "./OrderFlow.css";

function OrderFlow() {
  return (
    <div className="order-flow">
      <div className="order-flow__line" />

      <div className="order-flow__stage order-flow__stage--voice">
        <div className="order-flow__orb">
          <span />
          <span />
          <span />
        </div>

        <div className="order-flow__content">
          <span className="order-flow__label">
            Voice
          </span>

          <p>
            “Two jollof rice and one chicken.”
          </p>
        </div>
      </div>

      <div className="order-flow__connector">
        <span />
      </div>

      <div className="order-flow__stage order-flow__stage--understanding">
        <div className="order-flow__signal-bars">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="order-flow__content">
          <span className="order-flow__label">
            Understanding
          </span>

          <div className="order-flow__entities">
            <div>
              <span>Jollof Rice</span>
              <strong>× 2</strong>
            </div>

            <div>
              <span>Chicken</span>
              <strong>× 1</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="order-flow__connector">
        <span />
      </div>

      <div className="order-flow__stage order-flow__stage--action">
        <div className="order-flow__action-mark">
          ✓
        </div>

        <div className="order-flow__content">
          <span className="order-flow__label">
            Action
          </span>

          <div className="order-flow__result">
            <div>
              <span>New order</span>
              <strong>#1042</strong>
            </div>

            <p>Order created successfully.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderFlow;