# Backend Booking Controller Fix - 500 Error Resolution

## Issue
Creating a booking was failing with a 500 Internal Server Error.

## Root Causes

### 1. **Incorrect Price Calculation**
The backend was calculating `totalAmount = roomPrice + reservationFee`, but:
- `roomPrice` should be the subtotal (room price × periods)
- `reservationFee` should be 12% of the subtotal
- `totalAmount` should be subtotal + reservation fee

**Problem**: Backend was treating `reservationFee` as an addon instead of calculating it properly

### 2. **Wrong Period Calculation**
Backend was using `differenceInDays` which only works for full days:
```javascript
const numberOfNights = differenceInDays(checkOut, checkIn);
```
This fails for 12-hour period bookings (e.g., 12:00 PM to 12:00 AM = 0 days, but should be 1 period)

### 3. **Payment Status Logic**
Backend set: `paymentStatus: reservationFee > 0 ? 'reservation-paid' : 'unpaid'`
This incorrectly assumes if there's a reservation fee, it's already paid. We want all bookings to be 'unpaid' initially since payment is on arrival.

## Solution Applied

### Updated Backend Controller
```javascript
export const createBooking = async (req, res) => {
  try {
    const {
      roomId,
      checkInDate,
      checkOutDate,
      guests,
      specialRequests,
      reservationFee,
      numberOfNights, // Now accepting periods from frontend
    } = req.body;

    // ... validation code ...

    // Calculate based on 12-hour periods
    const periods = numberOfNights || Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 12));
    
    // Calculate amounts correctly
    const roomPrice = room.price * periods; // Subtotal
    const reservationFeeAmount = reservationFee || Math.round(roomPrice * 0.12); // 12%
    const totalAmount = roomPrice + reservationFeeAmount; // Final total

    const booking = await Booking.create({
      user: req.user._id,
      room: roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests,
      numberOfNights: periods, // Store periods
      roomPrice, // Subtotal
      reservationFee: reservationFeeAmount, // 12% fee
      totalAmount, // Subtotal + fee
      specialRequests,
      status: 'pending',
      paymentStatus: 'unpaid', // Always unpaid initially (pay on arrival)
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('room', 'name roomNumber images price floor')
      .populate('user', 'firstName lastName email phone');

    res.status(201).json(populatedBooking);
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: error.message });
  }
};
```

## Key Changes

### 1. **Accept `numberOfNights` from Frontend**
```javascript
const { numberOfNights } = req.body; // Periods calculated by frontend
```
Frontend already calculates periods correctly using:
```javascript
const periods = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 12));
```

### 2. **Fallback Calculation**
If frontend doesn't send it, backend calculates:
```javascript
const periods = numberOfNights || Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 12));
```

### 3. **Correct Price Flow**
```
Room Price (₱500) × Periods (2) = Subtotal (₱1,000)
Subtotal (₱1,000) × 12% = Reservation Fee (₱120)
Subtotal (₱1,000) + Fee (₱120) = Total (₱1,120)
```

### 4. **Payment Status**
All new bookings get `paymentStatus: 'unpaid'` since payment happens on arrival

### 5. **Added Console Error Logging**
```javascript
console.error('Booking creation error:', error);
```
This helps debug future issues

### 6. **Removed `differenceInDays` Dependency**
No longer uses `differenceInDays` from date-fns for period calculation

## Testing Steps

1. **Create a booking**:
   - Go to any room
   - Select dates (e.g., Oct 17 12:00 PM to Oct 18 12:00 AM)
   - This should be 1 period (12 hours)
   - Click Book Now

2. **Verify calculation**:
   - Check booking summary shows correct periods
   - Subtotal = room price × periods
   - Reservation fee = 12% of subtotal
   - Total = subtotal + reservation fee

3. **Check database**:
   ```javascript
   {
     numberOfNights: 1, // Actually 1 period (12 hours)
     roomPrice: 500, // Subtotal for 1 period
     reservationFee: 60, // 12% of 500
     totalAmount: 560, // 500 + 60
     paymentStatus: 'unpaid'
   }
   ```

4. **Verify in profile**:
   - Go to Profile → My Bookings
   - Booking should appear with correct details
   - Status: pending
   - Payment Status: unpaid

## Database Field Meanings

| Field | Meaning | Example |
|-------|---------|---------|
| `numberOfNights` | Number of 12-hour periods | 2 |
| `roomPrice` | Subtotal (price × periods) | ₱1,000 |
| `reservationFee` | 12% of subtotal | ₱120 |
| `totalAmount` | Subtotal + fee | ₱1,120 |
| `paymentStatus` | Payment state | 'unpaid' |
| `status` | Booking state | 'pending' |

## Error Handling

Backend now logs errors with:
```javascript
console.error('Booking creation error:', error);
```

Common errors to watch for:
- **Room not found**: Invalid roomId
- **Room not available**: Room marked as unavailable
- **Overlapping booking**: Dates conflict with existing booking
- **Invalid dates**: Check-out before check-in
- **Missing required fields**: guests, dates, etc.

## Next Steps

If booking still fails:
1. Check backend console for error details
2. Verify room exists and is available
3. Check no overlapping bookings exist
4. Verify JWT token is valid
5. Check MongoDB connection

---

**The 500 error should now be resolved! Try creating a booking again.** ✅
