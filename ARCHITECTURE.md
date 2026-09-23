# Architecture

## Current state

- **Frontend:** React with JSX, Vite, React Router, and plain CSS.
- **Routes:** `/` renders the landing page and `/dashboard` renders the dashboard. These are the intended MVP flow; there are no login or signup routes.
- **Data and behavior:** Dashboard conversations, activity, and order details are hard-coded examples. The talk control changes its displayed state without starting audio capture. Authentication is not implemented.
- **Vapi:** `src/api/vapi/index.js` is a minimal POST handler that logs the request and returns a generic acknowledgement. It is not connected to the frontend or real receptionist actions.
- **Supabase:** No Supabase client, dependency, schema, or integration is currently present.

## Planned state

Keep the first implementation small and centered on one useful business workflow. Supabase will hold business data; the backend/API will own business logic, validation, and data structures. Vapi should handle the voice conversation and send simple, structured requests to the backend. It should not become a second business-logic layer, and its tool schema should stay focused.

```text
Frontend
  ↓
Supabase
  ↓
Business data

Vapi
  ↓
Voice conversation
  ↓
AI receptionist
  ↓
Backend/API
  ↓
Business action
  ↓
Supabase
```

The frontend should read and present the appropriate business data. Voice requests should be validated and processed by the backend/API, which performs the business action and records its result in Supabase.
