# Tumamak Lodge - Pricing Policy

## Stay Duration
**12-Hour Stay Policy**: All room rates are based on 12-hour periods, not per night.

## Room Prices (Per 12 Hours)

### Ground Floor Rooms

| Room | Price (₱) |
|------|-----------|
| Room 1 | 500 |
| Room 2 | 500 |
| Room 3 | 900 |
| Room 4 | 500 |
| Room 5 | 500 |
| Room 6 | 900 |
| Room 7 | 500 |
| Room 8 | 1,600 |

### Upstairs Rooms

| Room | Price (₱) |
|------|-----------|
| Room 9 | 2,200 |
| Room 10 | 1,600 |
| Room 11 | 1,700 |
| Room 12 | 1,700 |
| Room 13 | 1,700 |
| Room 14 | 1,200 |
| Room 15 | 2,200 |
| Room 16 | 1,700 |

## Booking Calculation

When a customer books a room:
- The system calculates the duration between check-in and check-out times
- Duration is divided by 12 hours (43,200,000 milliseconds)
- The result is rounded up to the nearest whole number
- Total price = Room price × Number of 12-hour periods

### Examples:

**Example 1**: 8-hour stay
- Duration: 8 hours
- Periods: 1 (rounded up from 0.67)
- Room 1 cost: ₱500 × 1 = **₱500**

**Example 2**: 15-hour stay
- Duration: 15 hours
- Periods: 2 (rounded up from 1.25)
- Room 1 cost: ₱500 × 2 = **₱1,000**

**Example 3**: 24-hour stay (full day)
- Duration: 24 hours
- Periods: 2
- Room 1 cost: ₱500 × 2 = **₱1,000**
- Room 9 cost: ₱2,200 × 2 = **₱4,400**

**Example 4**: 36-hour stay
- Duration: 36 hours
- Periods: 3
- Room 1 cost: ₱500 × 3 = **₱1,500**

## Payment Policy

- **Pay on Arrival**: Customers can choose to pay the full amount upon arrival
- **Reservation Fee**: Alternatively, customers can pay a reservation fee to secure the booking and pay the balance on arrival

## Display Format

All prices are displayed as:
- Room cards: "From ₱[price] / 12h"
- Room details: "₱[price] per 12 hours"
- Booking summary: "₱[price] x [number] period(s)"

## Implementation Notes

### Backend
- Room prices stored in database match this pricing table
- Booking model calculates `numberOfNights` field (which now represents 12-hour periods)

### Frontend
- `RoomCard.jsx`: Shows "/ 12h" instead of "/night"
- `RoomDetailPage.jsx`: 
  - Shows "per 12 hours" instead of "per night"
  - Calculates periods using: `Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 12))`
  - Displays "x [number] period(s)" in price summary

---

**Last Updated**: October 17, 2025
