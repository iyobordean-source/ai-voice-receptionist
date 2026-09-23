import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
const supabase =
  supabaseUrl && supabaseSecretKey
    ? createClient(supabaseUrl, supabaseSecretKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      })
    : null;

function parseOrderItems(order) {
  const parts = order.split(",");

  if (parts.some((part) => !part.trim())) return null;

  const items = parts.map((part) => {
    const trimmedPart = part.trim();
    const match = trimmedPart.match(/^(\d+)\s+(.+)$/);
    const quantity = match ? Number(match[1]) : 1;
    const itemName = (match ? match[2] : trimmedPart).trim();

    if (!itemName || !Number.isSafeInteger(quantity) || quantity <= 0) {
      return null;
    }

    return {
      item_name: itemName,
      quantity,
    };
  });

  return items.some((item) => !item) ? null : items;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  const body = req.body;
  const customerName =
    typeof body?.customerName === "string" ? body.customerName.trim() : "";
  const customerPhone =
    typeof body?.customerPhone === "string"
      ? body.customerPhone.trim()
      : "";
  const orderText = typeof body?.order === "string" ? body.order.trim() : "";

  if (!customerName || !orderText) {
    return res.status(400).json({
      success: false,
      error: "customerName and order are required.",
    });
  }

  const items = parseOrderItems(orderText);

  if (!items) {
    return res.status(400).json({
      success: false,
      error: "Order must contain comma-separated item names with valid quantities.",
    });
  }

  return createOrder({ customerName, customerPhone, items }, res);
}

async function createOrder({ customerName, customerPhone, items }, res) {
  if (!supabase) {
    return res.status(500).json({
      success: false,
      error: "Server Supabase credentials are not configured.",
    });
  }

  try {
    const customerData = { name: customerName };

    if (customerPhone) customerData.phone = customerPhone;

    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .insert(customerData)
      .select("id")
      .single();

    if (customerError || !customer?.id) {
      console.error(
        "Supabase customer insert failed:",
        customerError?.message ?? "No customer ID returned."
      );

      return res.status(500).json({
        success: false,
        error: "Could not create customer.",
      });
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: customer.id,
        status: "new",
      })
      .select("id")
      .single();

    if (orderError || !order?.id) {
      console.error(
        "Supabase order insert failed:",
        orderError?.message ?? "No order ID returned."
      );

      return res.status(500).json({
        success: false,
        error: "Could not create order.",
        customerId: customer.id,
      });
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      item_name: item.item_name,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Supabase order item insert failed:", itemsError.message);

      return res.status(500).json({
        success: false,
        error: "Order was created, but its items could not be saved.",
        orderId: order.id,
      });
    }

    return res.status(201).json({
      success: true,
      orderId: order.id,
      customerId: customer.id,
      status: "new",
      items: orderItems,
    });
  } catch (error) {
    console.error("Order creation failed:", error?.message ?? error);

    return res.status(500).json({
      success: false,
      error: "Order could not be created.",
    });
  }
}
