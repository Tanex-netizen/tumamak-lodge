# Room Detail Page - Price Display Visual Guide

## 📱 What Users Will See

When viewing any room detail page, the price is now displayed in **4 prominent locations**:

---

## 1️⃣ HEADER PRICE BOX (Most Prominent)

```
┌─────────────────────────────────────────────────────────────┐
│  Room 1                             ╔════════════════════╗  │
│  Room G01 • Ground Floor            ║    ₱500.00         ║  │
│                                     ║  per 12 hours      ║  │
│                                     ╚════════════════════╝  │
└─────────────────────────────────────────────────────────────┘
```

- **Size**: Extra large (4xl)
- **Style**: Highlighted box with brown background and border
- **Always visible**: Yes, at the top of the page

---

## 2️⃣ ROOM DETAILS SUMMARY

```
┌─────────────────────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════════════════════╗  │
│  ║  Room Type          Room Size        Rate (12 hours)  ║  │
│  ║  Ground Floor       25 sqm           ₱500.00          ║  │
│  ╚═══════════════════════════════════════════════════════╝  │
└─────────────────────────────────────────────────────────────┘
```

- **Location**: After capacity, before description
- **Shows**: Quick summary of room details including price
- **Format**: Grid layout, responsive (2 cols mobile, 3 cols desktop)

---

## 3️⃣ PRICE BREAKDOWN (Appears after selecting dates)

```
┌─────────────────────────────────────────────────────────────┐
│  ╔══════════════ Price Breakdown ══════════════════════╗   │
│  ║                                                      ║   │
│  ║  ₱500.00 × 2 period(s) (12h each)     ₱1,000.00    ║   │
│  ║  ─────────────────────────────────────────────────  ║   │
│  ║  Total Price                           ₱1,000.00    ║   │
│  ║                                        ^^^^^^2xl     ║   │
│  ╚══════════════════════════════════════════════════════╝   │
└─────────────────────────────────────────────────────────────┘
```

- **Location**: Below date pickers
- **Conditional**: Only shows when both check-in and check-out dates are selected
- **Features**:
  - Shows base price per period
  - Calculates number of 12-hour periods
  - Shows subtotal
  - **Total Price in extra large bold text (2xl)**

---

## 4️⃣ ROOM CARD (On Rooms Page)

```
┌────────────────────────────┐
│  [Room Image]              │
│                            │
│  Room 1                    │
│  ⭐⭐⭐ (0 reviews)        │
│                            │
│  From ₱500 / 12h          │
│                            │
│  [View Details Button]     │
└────────────────────────────┘
```

---

## 💡 Example Scenarios

### Scenario 1: Quick Glance
**User Action**: Opens room detail page  
**Sees**: Large price box at top right: **₱500.00 per 12 hours**

### Scenario 2: Checking Details
**User Action**: Scrolls down to read description  
**Sees**: Summary box with room info including **Rate: ₱500.00**

### Scenario 3: Planning Booking
**User Action**: Selects dates (24-hour stay)  
**Sees**: 
```
Price Breakdown
₱500.00 × 2 period(s) (12h each)  =  ₱1,000.00
────────────────────────────────────────────
Total Price                         ₱1,000.00
```

### Scenario 4: Extended Stay
**User Action**: Selects dates (3-day/72-hour stay)  
**Sees**:
```
Price Breakdown
₱500.00 × 6 period(s) (12h each)  =  ₱3,000.00
────────────────────────────────────────────
Total Price                         ₱3,000.00
```

---

## 🎨 Visual Design Elements

### Colors Used:
- **Price Text**: Brown-900 (darkest brown for emphasis)
- **Background**: Brown-100 (light brown for subtle highlight)
- **Border**: Brown-300 (medium brown for definition)
- **Labels**: Brown-600/700 (medium brown for readability)

### Typography:
- **Header Price**: text-4xl (36px) + font-bold
- **Total Price**: text-2xl (24px) + font-bold
- **Summary Price**: text-lg (18px) + font-semibold
- **Breakdown Price**: text-base (16px) + font-semibold

### Spacing:
- Generous padding in price boxes (px-4 py-3 to p-5)
- Clear separation with borders
- Consistent gap between elements

---

## ✅ Success Criteria

Users will clearly see the room price because:

1. ✅ **Immediate Visibility**: Large price box at top of page
2. ✅ **Multiple Confirmations**: Price shown 4 times in different contexts
3. ✅ **Clear Labeling**: "per 12 hours" always accompanies the price
4. ✅ **Professional Formatting**: PHP currency format with comma separators
5. ✅ **Interactive Feedback**: Price breakdown updates when dates change
6. ✅ **Visual Hierarchy**: Most important info (total) is largest and boldest
7. ✅ **Responsive Design**: Readable on all device sizes

---

**Status**: ✅ Fully Implemented  
**Last Updated**: October 17, 2025
