# Tables And Reservations Functional Spec

## Verdict

**Verdict**: requirement acknowledged

## Scope

Build functional table booking across the admin panel and customer reservation flow.

This spec covers:

- New admin sidebar section: `Tables`
- Admin table capacity settings
- Customer reservation availability check
- Customer booking modal flow
- Booking creation and persistence
- Admin bookings table
- Backend read APIs and write APIs needed for this flow

This spec does not cover:

- Online payment
- Deposit collection
- Staff assignment
- Table-specific floor-plan layout
- Authentication hardening
- SMS or WhatsApp confirmation
- Email confirmation
- Cancellation or rescheduling by the customer

Those can be added later, but they should not be mixed into the first functional version.

## Existing System Context

The project currently has a backend `Reservation` model, but that model is CMS/page-content data for the reservation page. It contains fields like image, tabs, title, description, helper text, CTA labels, and content-managed time slots.

That model should not become the operational booking model.

Operational reservations need separate models because they represent transactional state:

- Restaurant capacity settings
- User bookings
- Availability per date and slot
- Booking status

Mixing these into the CMS `Reservation` document would make page editing and booking operations dependent on the same document, which is fragile.

## Data Model

### 1. Table Settings Model

Create a new model for restaurant table configuration.

Suggested name:

`TableSettings`

Purpose:

- Stores the current restaurant availability configuration controlled by admin.
- There should be one active settings document for the restaurant.
- The frontend uses this to generate time slots and calculate availability.

Fields:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `restaurantKey` | String | Yes | Default can be `ikayi`; unique key for single-restaurant setup. |
| `numberOfTables` | Number | Yes | Minimum `1`. |
| `chairsPerTable` | Number | Yes | Minimum `1`. This is the user-requested "Number of chairs". |
| `openingTime` | String | Yes | Default `12:00`; store in 24-hour `HH:mm` format. |
| `closingTime` | String | Yes | Default `00:00`; represents 12 AM next day. |
| `slotLengthMinutes` | Number | Yes | Default `60`; minimum `15`; first version should use `60`. |
| `timezone` | String | Yes | Default `Asia/Kolkata`. |
| `isActive` | Boolean | Yes | Default `true`. |
| `createdAt` | Date | Auto | Mongoose timestamps. |
| `updatedAt` | Date | Auto | Mongoose timestamps. |

Derived value:

`availability = numberOfTables * chairsPerTable`

Do not store `availability` as a separate field in MongoDB for v1. It is derived and should be calculated in API responses and UI.

Reason:

If `availability` is stored, it can drift from `numberOfTables` and `chairsPerTable` unless every update path maintains it correctly.

### 2. Booking Model

Create a separate booking model.

Suggested name:

`TableBooking`

Purpose:

- Stores confirmed customer booking records.
- Admin `Bookings` section reads this model.
- Availability calculation subtracts active bookings from the slot capacity.

Fields:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `bookingReference` | String | Yes | Unique human-readable reference, generated server-side. |
| `customerName` | String | Yes | Trimmed. |
| `phoneNumber` | String | Yes | Store normalized value if possible. |
| `guestCount` | Number | Yes | Minimum `1`. |
| `bookingDate` | String | Yes | Store as `YYYY-MM-DD` in restaurant timezone. |
| `slotStart` | String | Yes | `HH:mm`, e.g. `18:00`. |
| `slotEnd` | String | Yes | `HH:mm`, e.g. `19:00`. |
| `status` | String | Yes | `confirmed`, `cancelled`, `completed`, `no_show`. Default `confirmed`. |
| `source` | String | Yes | Default `website`. |
| `notes` | String | No | Optional internal notes later. |
| `createdAt` | Date | Auto | Mongoose timestamps. |
| `updatedAt` | Date | Auto | Mongoose timestamps. |

Indexes:

- Unique index on `bookingReference`
- Compound index on `{ bookingDate: 1, slotStart: 1, status: 1 }`
- Index on `{ createdAt: -1 }`

Do not store "tables left" on the booking.

Reason:

Tables left is derived from capacity minus active booked guests for a slot. Storing it on each booking will become stale when another booking is added, cancelled, or when admin changes capacity.

## Availability Logic

### Definition

For a specific date and hour slot:

`totalAvailability = numberOfTables * chairsPerTable`

`bookedGuests = sum(guestCount of confirmed bookings for same bookingDate and slotStart)`

`remainingAvailability = totalAvailability - bookedGuests`

A slot is bookable if:

`remainingAvailability >= requestedGuestCount`

### Important Correction

The requirement says:

"Availability is simply Number of Tables x Number of chairs."

That is correct for the capacity metric shown on the admin `Tables` page.

For the customer booking flow, the available seats for a specific slot must be:

`Number of Tables x Number of chairs - already confirmed guests for that slot`

If the frontend only checks total capacity and ignores existing bookings, it will overbook.

### Concurrency Requirement

The final create-booking API must re-check availability on the backend immediately before saving the booking.

Reason:

Two users can view the same available slot at the same time. If both submit, frontend-only checking will allow overbooking. The backend must be the authority.

For v1, a backend re-check before insert is acceptable. If traffic increases, move this to a MongoDB transaction or a per-slot counter document with atomic conditional updates.

## Admin Panel

### Sidebar

Add a new sidebar item:

`Tables`

Recommended order:

1. Overview
2. Tables
3. Bookings
4. Pages & content
5. Settings

Reason:

Tables controls operational availability, so it should sit near Bookings, not inside Pages & content.

### Tables Page

Route/view:

`/admin`, active sidebar section `Tables`

This can be implemented as an internal admin view first, matching the existing admin structure, rather than a separate Next route.

Fields:

1. Number of tables
2. Number of chairs
3. Opening time
4. Closing time
5. Slot length

Defaults:

- Number of tables: choose a seed/default value during implementation if no document exists
- Number of chairs: choose a seed/default value during implementation if no document exists
- Opening time: `12:00`
- Closing time: `00:00`
- Slot length: `60`

Read-only metric:

- Availability
- Formula displayed: `Number of tables x Number of chairs`
- Value updates immediately on the client as the admin edits table/chair fields

Save behavior:

- Admin edits fields locally.
- Availability preview updates immediately.
- Admin clicks Save.
- Backend validates and persists the settings.
- After save, frontend uses the saved settings for customer availability.

Validation:

- `numberOfTables` must be an integer greater than `0`.
- `chairsPerTable` must be an integer greater than `0`.
- `openingTime` and `closingTime` must be valid `HH:mm`.
- `slotLengthMinutes` must be a positive integer.
- For v1, use `60` minutes in the UI by default.

UX states:

- Loading state while settings are fetched.
- Save disabled while request is in progress.
- Error message on failed save.
- Success state after save.

### Bookings Page

Route/view:

`/admin`, active sidebar section `Bookings`

Replace the current static bookings array usage with backend data.

Table columns:

| Column | Source |
| --- | --- |
| Reference | `bookingReference` |
| Name | `customerName` |
| Phone | `phoneNumber` |
| Guests | `guestCount` |
| Date | `bookingDate` |
| Time | `slotStart` - `slotEnd` |
| Status | `status` |
| Created | `createdAt` |

For v1, this page can be read-only except status changes if already easy.

Minimum v1:

- Show all bookings
- Sort newest first
- Display empty state if no bookings exist

## Customer Reservation Flow

Page:

`/reservations`

The booking UI should be modal-based after slot selection, not a completely separate page.

### Flow

1. User selects date.
2. User enters number of people.
3. User clicks `Check Availability`.
4. Frontend calls availability API with date and guest count.
5. API returns generated hourly slots with remaining availability.
6. Frontend displays only bookable slots, or displays all slots with unavailable disabled.
7. User selects a slot.
8. Booking details modal opens.
9. User enters name and phone number.
10. User confirms booking.
11. Frontend calls create-booking API.
12. Backend re-checks availability.
13. If available, backend saves booking and returns reference.
14. Frontend shows confirmation state.

### Slot Display

Each slot should show:

- Time range, e.g. `12:00 PM - 1:00 PM`
- Remaining availability, e.g. `12 seats left`

The user wording can say "seats left" rather than "tables left" because the requirement defines availability as table count multiplied by chairs.

If the UI says "tables left", that is technically wrong under the current rule because the system is not assigning individual physical tables.

### Personal Details Modal

Fields:

- Name
- Phone number
- Number of people, read-only summary
- Date, read-only summary
- Time slot, read-only summary

Actions:

- Confirm booking
- Back/change slot
- Close modal

Validation:

- Name required
- Phone required
- Guest count must match the checked availability request unless the user goes back and checks again

## Backend APIs

### Admin Table Settings

#### GET `/api/admin/tables/settings`

Returns current settings. If no settings document exists, backend can create or return defaults.

Response:

```json
{
  "settings": {
    "numberOfTables": 10,
    "chairsPerTable": 4,
    "openingTime": "12:00",
    "closingTime": "00:00",
    "slotLengthMinutes": 60,
    "timezone": "Asia/Kolkata",
    "availability": 40
  }
}
```

#### PUT `/api/admin/tables/settings`

Updates settings.

Request:

```json
{
  "numberOfTables": 10,
  "chairsPerTable": 4,
  "openingTime": "12:00",
  "closingTime": "00:00",
  "slotLengthMinutes": 60
}
```

Response:

```json
{
  "settings": {
    "numberOfTables": 10,
    "chairsPerTable": 4,
    "openingTime": "12:00",
    "closingTime": "00:00",
    "slotLengthMinutes": 60,
    "timezone": "Asia/Kolkata",
    "availability": 40
  }
}
```

### Public Availability

#### GET `/api/reservations/availability?date=2026-08-10&guestCount=4`

Returns slots generated from admin table settings.

Response:

```json
{
  "date": "2026-08-10",
  "guestCount": 4,
  "slots": [
    {
      "slotStart": "12:00",
      "slotEnd": "13:00",
      "label": "12:00 PM - 1:00 PM",
      "totalAvailability": 40,
      "bookedGuests": 8,
      "remainingAvailability": 32,
      "isAvailable": true
    }
  ]
}
```

Filtering choice:

- Backend should return all slots with `isAvailable`.
- Frontend can decide whether to hide unavailable slots or disable them.

Reason:

Returning all slots makes the UI more explainable and avoids repeated backend changes when UX changes.

### Public Booking Creation

#### POST `/api/reservations/bookings`

Creates a booking.

Request:

```json
{
  "customerName": "Aarav Mehta",
  "phoneNumber": "+919876543210",
  "guestCount": 4,
  "bookingDate": "2026-08-10",
  "slotStart": "19:00"
}
```

Response:

```json
{
  "booking": {
    "bookingReference": "IKY-20260810-0001",
    "customerName": "Aarav Mehta",
    "phoneNumber": "+919876543210",
    "guestCount": 4,
    "bookingDate": "2026-08-10",
    "slotStart": "19:00",
    "slotEnd": "20:00",
    "status": "confirmed"
  }
}
```

Failure response when no longer available:

```json
{
  "error": "Selected slot is no longer available for this guest count."
}
```

Expected HTTP status:

- `201` for created booking
- `400` for invalid input
- `409` for slot no longer available
- `500` for unexpected server failure

### Admin Bookings

#### GET `/api/admin/bookings`

Returns bookings for admin table.

Query options for later:

- `status`
- `date`
- `page`
- `limit`

For v1:

- Return newest first.
- No pagination needed unless the implementation is already trivial.

Response:

```json
{
  "bookings": [
    {
      "bookingReference": "IKY-20260810-0001",
      "customerName": "Aarav Mehta",
      "phoneNumber": "+919876543210",
      "guestCount": 4,
      "bookingDate": "2026-08-10",
      "slotStart": "19:00",
      "slotEnd": "20:00",
      "status": "confirmed",
      "createdAt": "2026-08-05T12:00:00.000Z"
    }
  ]
}
```

Optional v1.1:

#### PATCH `/api/admin/bookings/:bookingReference/status`

Allows admin to update status.

Request:

```json
{
  "status": "cancelled"
}
```

This is not required for the first read-only admin bookings table, but it is the clean next step.

## Slot Generation Rules

Opening time:

`12:00`

Closing time:

`00:00`

Slot length:

`60` minutes

Generated slots:

- `12:00` - `13:00`
- `13:00` - `14:00`
- `14:00` - `15:00`
- `15:00` - `16:00`
- `16:00` - `17:00`
- `17:00` - `18:00`
- `18:00` - `19:00`
- `19:00` - `20:00`
- `20:00` - `21:00`
- `21:00` - `22:00`
- `22:00` - `23:00`
- `23:00` - `00:00`

Because closing time is `00:00`, the backend must treat it as next-day midnight when generating same-day slots.

Do not generate a `00:00` - `01:00` slot unless opening and closing settings explicitly require it.

## Implementation Plan

### Phase 1: Backend Models And APIs

Files likely touched:

- `backend/src/models/TableSettings.js`
- `backend/src/models/TableBooking.js`
- `backend/src/controllers/tableSettingsController.js`
- `backend/src/controllers/tableBookingsController.js`
- `backend/src/routes/tableSettingsRoutes.js`
- `backend/src/routes/tableBookingsRoutes.js`
- `backend/src/server.js`

Work:

1. Create `TableSettings` model.
2. Create `TableBooking` model.
3. Add settings read/update APIs.
4. Add public availability API.
5. Add public create-booking API.
6. Add admin bookings read API.
7. Mount routes in server.
8. Validate with `node --check`.
9. Test endpoints locally with `Invoke-WebRequest`.

### Phase 2: Admin Tables Page

Files likely touched:

- `frontend/components/admin/AdminSidebar.tsx`
- `frontend/components/admin/AdminDashboard.tsx`
- `frontend/components/admin/AdminDashboard.module.css`

Work:

1. Add `tables` admin view.
2. Add sidebar item.
3. Fetch settings from backend.
4. Render editable table/chair/time/slot fields.
5. Show derived availability dynamically.
6. Save settings through backend API.

### Phase 3: Admin Bookings Page

Files likely touched:

- `frontend/components/admin/AdminDashboard.tsx`
- `frontend/components/admin/AdminDashboard.module.css`
- Possibly remove dependency on `bookings` from `adminDashboardData.ts` after confirmation.

Work:

1. Fetch bookings from backend.
2. Render booking table.
3. Replace static empty `bookings` array.
4. Keep status editing out of v1 unless explicitly requested.

Dead code to confirm before deleting:

- `bookings` export in `frontend/components/admin/adminDashboardData.ts`

Do not delete it silently.

### Phase 4: Customer Reservation Modal Flow

Files likely touched:

- `frontend/app/reservations/page.tsx`
- `frontend/app/reservations/page.module.css`
- Optional: create a child component only if the page becomes too large.

Work:

1. Convert static booking card to client-side interactive flow.
2. Let user select date and guest count.
3. Call availability API.
4. Display slots with remaining seats.
5. Open modal after slot selection.
6. Collect name and phone.
7. Submit booking.
8. Show confirmation with booking reference.

File-size warning:

`frontend/app/reservations/page.tsx` may become too large if the full modal and API logic are added directly. If it crosses roughly 300-400 lines, split the booking form/modal into a local component file under the reservations page folder before continuing.

## Validation Checklist

Backend:

- `node --check` passes for every new backend file.
- `GET /api/admin/tables/settings` returns defaults or saved settings.
- `PUT /api/admin/tables/settings` persists changed table/chair values.
- `GET /api/reservations/availability` returns hourly slots.
- Availability decreases after a booking is created.
- `POST /api/reservations/bookings` rejects over-capacity booking with `409`.
- `GET /api/admin/bookings` shows created bookings.

Frontend admin:

- Sidebar shows `Tables`.
- Tables view loads current settings.
- Changing number of tables or chairs updates Availability immediately before save.
- Save persists values.
- Bookings page fetches backend bookings.

Frontend customer:

- User enters guest count and date.
- Check Availability shows bookable slots.
- Slot displays remaining seats.
- Selecting a slot opens modal.
- Modal creates booking.
- Confirmation shows booking reference.
- Admin bookings page shows the new booking after refresh.

## Risks

### Overbooking

Frontend-only availability checking will break under concurrent users. Backend must re-check before creating a booking.

### Misleading "Tables Left" Label

The requested capacity model is seat-based, not table-assignment-based. If the UI says "tables left", it will be inaccurate. Use "seats left" or "availability left".

### Existing `Reservation` Model Confusion

The existing `Reservation` model is CMS content. Reusing it for transactional bookings will make the system hard to maintain and will mix admin page editing with user booking records.

### Admin Capacity Changes After Bookings

If admin lowers capacity after bookings already exist, existing bookings should remain valid. Future availability should calculate remaining availability from the new capacity. If booked guests already exceed the new capacity, the slot should show zero availability, not negative availability.

### Date And Timezone Bugs

All date and slot calculations should use restaurant timezone, `Asia/Kolkata`, not browser local time or server local time.

## Recommended V1 Decision

Build this as:

- One `TableSettings` document
- One `TableBooking` collection
- Seat-based hourly availability
- Backend-authoritative booking creation
- Admin `Tables` page for settings
- Admin `Bookings` page for read-only booking table
- Customer modal flow on `/reservations`

This is the smallest version that satisfies the requirement without locking the system into a broken capacity model.
