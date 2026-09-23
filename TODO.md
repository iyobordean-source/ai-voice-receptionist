# Roadmap

Keep work focused on a convincing MVP and validate the smallest useful business workflow before expanding scope.

## Phase 1 — Foundation

1. Keep the MVP flow focused on the landing page (`/`) and dashboard (`/dashboard`).
2. Set up Supabase and the initial database schema with appropriate row-level security (RLS).
3. Add authentication when it is needed for the chosen demo/client workflow.
4. Create a business profile and connect the dashboard to real business data.
5. Protect dashboard access where authentication is enabled.

## Phase 2 — Receptionist

1. Configure Vapi for the selected demo business and workflow.
2. Write the receptionist prompt and provide business knowledge/context.
3. Handle calls and pass focused, structured requests to the backend/webhook/API.
4. Validate requests, perform real business actions, and record outcomes.

## Phase 3 — Demo polish

1. Make demo data realistic and clearly distinguish it from live data.
2. Add useful conversation history and an activity feed.
3. Show accurate call states and completed business actions.
4. Polish onboarding for setting up the demo business.

## Phase 4 — Client version

Start this phase only after securing a paying client. Scope items to that client's needs:

- Nigerian phone number
- WhatsApp integration, if needed
- Required real business integrations
- Domain and production deployment
- Monitoring
- Client-specific configuration
