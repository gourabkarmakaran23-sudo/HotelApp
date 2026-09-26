# Checkout Test Plan

## 1. Purpose

Validate the hotel checkout flow from the booking list and Direct Checkout page, including booking search, billing data, advance amount, total due, split payments, successful checkout, and protection against duplicate checkout.

## 2. Environment

- Operating system: Windows
- API: `http://localhost:5287`
- Angular application: `http://localhost:4200`
- Frontend folder: `client-app`
- Solution file: `HotelRestaurant.sln`

## 3. Start the Application

Open two terminals from the repository root.

### Terminal 1: Start the API

```powershell
dotnet run --project src/HotelRestaurant.Api --launch-profile http
```

Confirm that the API is listening on `http://localhost:5287`.

### Terminal 2: Start Angular

```powershell
npm --prefix client-app start
```

Open:

```text
http://localhost:4200
```

Log in with a valid application account. The account must have access to Booking List, Check-in, and Checkout.

## 4. Test Data Requirements

Prepare these records before testing:

1. One active booking with a guest, room, check-in date, check-out date, and a positive total amount.
2. The booking should be checked in before checkout testing.
3. The booking should have an advance payment for testing Advance Amount and Total Due.
4. At least two payment methods must exist, for example Cash and Card.
5. One booking that has already been checked out for duplicate-checkout testing.

If no suitable booking exists, create a booking from Booking Engine, assign a room, check the guest in, and then use that booking for checkout.

## 5. Quick Smoke Test

1. Open `Booking List`.
2. Select an active checked-in booking.
3. Click its `Checkout` action.
4. Confirm the checkout page shows the booking number, guest name, room number, room rent, advance amount, and total due.
5. Select a payment mode and enter the exact Total Due amount.
6. Confirm the validation message says the checkout is ready.
7. Click `COMPLETE CHECKOUT`.
8. Confirm the success message appears.
9. Return to Booking List or Check-in and confirm the booking is no longer available as an active checkout candidate.

Expected result: the booking is checked out successfully, its rooms become available, and the page does not show stale checkout data.

## 6. Detailed Test Cases

| ID | Test case | Steps | Expected result | Result |
|---|---|---|---|---|
| CHK-001 | Open checkout from Booking List | Open Booking List and click Checkout for an active booking. | Checkout page opens with the selected booking loaded. | [ ] Pass [ ] Fail |
| CHK-002 | Verify booking context | Check booking number, guest name, room number, dates, and room type. | Values belong to the selected booking and are not blank or from a previous booking. | [ ] Pass [ ] Fail |
| CHK-003 | Verify billing values | Compare Room Rent, Advance Amount, Total Due, Total Tax, and Subtotal with the booking invoice. | Values match the backend booking/invoice data. | [ ] Pass [ ] Fail |
| CHK-004 | Direct Checkout page | Open `http://localhost:4200/direct-checkout` without a booking ID. | Search panel is displayed and no unrelated booking is loaded. | [ ] Pass [ ] Fail |
| CHK-005 | Search by booking number | Enter a complete or partial booking number and click Search. | Matching booking results appear with guest, room, dates, and status. | [ ] Pass [ ] Fail |
| CHK-006 | Search by guest name | Search using the guest's first name, last name, or part of the name. | Matching booking appears and can be selected. | [ ] Pass [ ] Fail |
| CHK-007 | Search with no value | Leave the search field empty and click Search. | A validation message asks for a booking number or guest name. No API search is performed. | [ ] Pass [ ] Fail |
| CHK-008 | Search with no match | Enter a value that does not exist. | A clear no-matching-booking message appears. | [ ] Pass [ ] Fail |
| CHK-009 | Clear search | Enter a search value, run a search, then click Clear. | Search text, results, and search error are cleared. | [ ] Pass [ ] Fail |
| CHK-010 | Select a search result | Search for a booking and select the result card. | The selected booking loads into the checkout page with correct billing details. | [ ] Pass [ ] Fail |
| CHK-011 | No payment entered | Load a booking with a positive Total Due and leave payment amount as zero. | Complete Checkout remains disabled and the page asks for a payment amount. | [ ] Pass [ ] Fail |
| CHK-012 | Payment amount below due | Enter an amount lower than Total Due. | Complete Checkout remains disabled and the shortfall is shown. | [ ] Pass [ ] Fail |
| CHK-013 | Payment mode required | Enter a positive payment amount but leave Payment Mode empty. | Complete Checkout remains disabled and the user is asked to select a payment mode. | [ ] Pass [ ] Fail |
| CHK-014 | Exact payment | Select a payment mode and enter exactly Total Due. | Remaining amount becomes zero, validation turns successful, and checkout can proceed. | [ ] Pass [ ] Fail |
| CHK-015 | Split payment | Click Add Payment. Enter part of the due in Cash and the remainder in Card. | Collected amount equals the sum of entries and checkout becomes available when fully settled. | [ ] Pass [ ] Fail |
| CHK-016 | Split payment missing mode | Enter positive amounts in two entries but leave one payment mode empty. | Checkout is blocked until every submitted payment entry has a mode. | [ ] Pass [ ] Fail |
| CHK-017 | Overpayment/change | Enter more than Total Due. | Change amount is calculated and displayed. Confirm this behavior matches the business payment policy before accepting checkout. | [ ] Pass [ ] Fail |
| CHK-018 | Complete checkout | Submit a valid exact or split payment. | Success alert appears, booking status becomes CheckedOut, payment is saved, and rooms become Available. | [ ] Pass [ ] Fail |
| CHK-019 | Duplicate checkout from list | Return to Booking List and try Checkout on the same booking. | Action is blocked with an already-checked-out message. | [ ] Pass [ ] Fail |
| CHK-020 | Duplicate checkout by stale URL | Open `/direct-checkout?bookingId=<checked-out-booking-id>`. | Booking is rejected with an already-checked-out message; no checkout form is usable. | [ ] Pass [ ] Fail |
| CHK-021 | Direct URL with active booking | Open `/direct-checkout?bookingId=<active-booking-id>`. | Active booking loads normally. | [ ] Pass [ ] Fail |
| CHK-022 | Back and cancel navigation | Click Back to List and CANCEL. | User returns to the Check-in/list page without submitting checkout. | [ ] Pass [ ] Fail |
| CHK-023 | Proforma | Load a booking and click Room Rent Proforma. | A printable proforma opens with booking, guest, room, and billing details. | [ ] Pass [ ] Fail |
| CHK-024 | Room status after checkout | Open Room Status after completing checkout. | The checked-out room is shown as available according to the live reservation data. | [ ] Pass [ ] Fail |

## 7. Build Verification

Run from the repository root:

```powershell
npm --prefix client-app run build
dotnet build HotelRestaurant.sln --nologo
```

Expected result:

- Angular reports `Application bundle generation complete.`
- .NET reports `Build succeeded.`
- The Angular bundle budget warning may appear; it is currently non-blocking.

## 8. Automated Tests

Frontend unit tests can be attempted with:

```powershell
npm --prefix client-app test -- --watch=false --browsers=ChromeHeadless
```

Current known test-suite issues are outside the checkout implementation:

- `app.component.spec.ts` still expects an `AppComponent.title` property that no longer exists.
- Karma reports AG Grid CSS loading errors for `ag-grid.css` and `ag-theme-quartz.css`.

The production Angular build and .NET solution build pass independently.

## 9. Test Evidence to Record

For each failed case, record:

- Test case ID
- Login user or role
- Booking number
- Browser and version
- Exact steps used
- Expected result
- Actual result
- Screenshot or console/API error
- Date and tester name

## 10. Final Sign-off

- Tester: ______________________________
- Test date: ___________________________
- Build/version: _______________________
- Passed cases: _______________________
- Failed cases: _______________________
- Known issues accepted: ______________
- Sign-off: [ ] Approved [ ] Needs Fixes
