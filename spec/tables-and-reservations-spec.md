# Tables And Reservations Task Index

## Verdict

**Verdict**: requirement acknowledged

## Why This Is Split

The full tables and reservations work touches backend models, backend APIs, admin UI, customer UI, and booking availability logic. Doing all of it in one pass increases the chance of mixing CMS content with transactional booking state, missing overbooking checks, or changing too much admin UI at once.

Use this index as the execution order. Complete and verify one task before starting the next.

## Non-Negotiable Architecture Decisions

- Keep the existing backend `Reservation` model for CMS/page content only.
- Create separate operational models for table settings and user bookings.
- Admin `Tables` controls capacity settings.
- Admin `Bookings` reads user booking records.
- Customer `/reservations` uses backend availability, not static time slots.
- Backend must re-check availability before creating a booking.
- Display seat availability, not "tables left", unless physical table assignment is added later.

## Task Order

| Task | File | Purpose | Stop Point |
| --- | --- | --- | --- |
| 01 | `tables-reservations-task-01-backend-models.md` | Add operational MongoDB models only. | Models validate with `node --check`; no routes yet. |
| 02 | `tables-reservations-task-02-admin-table-settings-api.md` | Add admin read/update APIs for table settings. | Settings can be fetched and saved from HTTP. |
| 03 | `tables-reservations-task-03-public-availability-api.md` | Generate customer-visible hourly availability slots. | Availability endpoint returns correct slots and remaining seats. |
| 04 | `tables-reservations-task-04-create-booking-api.md` | Create bookings with backend capacity re-check. | Booking saves and over-capacity requests return `409`. |
| 05 | `tables-reservations-task-05-admin-tables-ui.md` | Add admin `Tables` sidebar/view. | Admin can edit settings and see live availability metric. |
| 06 | `tables-reservations-task-06-admin-bookings-ui.md` | Replace static bookings with backend bookings table. | New customer booking appears in admin after refresh. |
| 07 | `tables-reservations-task-07-customer-reservation-modal.md` | Build customer availability and details modal flow. | User can check slots and submit a booking from `/reservations`. |
| 08 | `tables-reservations-task-08-final-integration-qa.md` | End-to-end verification and cleanup review. | Full flow works without static booking data. |

## Execution Rule

Do not start the next task until the current task has its stop-point validation completed.

## Files

- [Task 01: Backend Models](./tables-reservations-task-01-backend-models.md)
- [Task 02: Admin Table Settings API](./tables-reservations-task-02-admin-table-settings-api.md)
- [Task 03: Public Availability API](./tables-reservations-task-03-public-availability-api.md)
- [Task 04: Create Booking API](./tables-reservations-task-04-create-booking-api.md)
- [Task 05: Admin Tables UI](./tables-reservations-task-05-admin-tables-ui.md)
- [Task 06: Admin Bookings UI](./tables-reservations-task-06-admin-bookings-ui.md)
- [Task 07: Customer Reservation Modal](./tables-reservations-task-07-customer-reservation-modal.md)
- [Task 08: Final Integration QA](./tables-reservations-task-08-final-integration-qa.md)

## Deferred Work

- Payment or deposits
- SMS, WhatsApp, or email confirmation
- Customer cancellation and rescheduling
- Floor-plan table assignment
- Admin booking status editing
- Pagination and filtering for bookings
- Authentication hardening
