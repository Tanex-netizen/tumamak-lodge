# BookingPage - Visual Layout Guide

## 📐 Page Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Complete Your Booking                             │
│                Fill in the details below to reserve your room            │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────┬───────────────────────────────────┐
│  BOOKING FORM (Left - 2/3 width)     │  SUMMARY (Right - 1/3 width)     │
│                                      │                                   │
│  ┌─────────────────────────────┐    │  ┌─────────────────────────────┐ │
│  │ 📅 Select Dates             │    │  │  Booking Summary            │ │
│  │                             │    │  │                             │ │
│  │  Check-in: [Date Picker]   │    │  │  🛏️ Room 1                 │ │
│  │  Check-out: [Date Picker]  │    │  │  Ground Floor               │ │
│  └─────────────────────────────┘    │  │  ───────────────────────────│ │
│                                      │  │  Check-in: Oct 17, 2:00 PM  │ │
│  ┌─────────────────────────────┐    │  │  Check-out: Oct 18, 2:00 PM │ │
│  │ 👥 Number of Guests         │    │  │  Duration: 2 period(s)      │ │
│  │                             │    │  │  ───────────────────────────│ │
│  │  Adults:   [  2  ] Max: 2   │    │  │  Guests: 2 Adults, 1 Child  │ │
│  │  Children: [  1  ] Max: 1   │    │  │  ───────────────────────────│ │
│  └─────────────────────────────┘    │  │  ₱500 × 2 periods           │ │
│                                      │  │              ₱1,000         │ │
│  ┌─────────────────────────────┐    │  │  ═══════════════════════════│ │
│  │ Special Requests (Optional) │    │  │  Total Amount:              │ │
│  │  ┌─────────────────────────┐│    │  │  ₱1,000.00                 │ │
│  │  │                         ││    │  │  ═══════════════════════════│ │
│  │  │ Type here...            ││    │  │  ╔═══════════════════════╗ │ │
│  │  │                         ││    │  │  ║ Pay full amount       ║ │ │
│  │  │                         ││    │  │  ║ on arrival            ║ │ │
│  │  └─────────────────────────┘│    │  │  ╚═══════════════════════╝ │ │
│  └─────────────────────────────┘    │  └─────────────────────────────┘ │
│                                      │                                   │
│  ┌─────────────────────────────┐    │                                   │
│  │ 💰 Payment Method           │    │                                   │
│  │                             │    │                                   │
│  │  ○ Pay Full Amount          │    │                                   │
│  │    Pay ₱1,000 on arrival    │    │                                   │
│  │                             │    │                                   │
│  │  ● Pay Reservation Fee 30%  │    │                                   │
│  │    Pay ₱300 now, ₱700 later│    │                                   │
│  └─────────────────────────────┘    │                                   │
│                                      │                                   │
│  ┌─────────────────────────────┐    │                                   │
│  │   CONFIRM BOOKING BUTTON    │    │                                   │
│  └─────────────────────────────┘    │                                   │
└──────────────────────────────────────┴───────────────────────────────────┘
```

## 🎨 Component Details

### 1. Select Dates Section
```
┌──────────────────────────────────────────────────┐
│  📅 Select Dates                                 │
│                                                  │
│  Check-in Date & Time        Check-out Date     │
│  ┌──────────────────────┐   ┌────────────────┐ │
│  │ October 17, 2025     │   │ October 18,    │ │
│  │ 2:00 PM          ▼   │   │ 2:00 PM    ▼   │ │
│  └──────────────────────┘   └────────────────┘ │
└──────────────────────────────────────────────────┘
```

**Features:**
- Calendar icon header
- Two date pickers side by side (responsive)
- Time selection included
- Dropdown for selecting date and time

### 2. Guest Selection
```
┌──────────────────────────────────────────────────┐
│  👥 Number of Guests                             │
│                                                  │
│  Adults                      Children            │
│  ┌──────────────────────┐   ┌────────────────┐ │
│  │  2             ▲▼    │   │  1         ▲▼  │ │
│  └──────────────────────┘   └────────────────┘ │
│  Max: 2 adults               Max: 1 children    │
└──────────────────────────────────────────────────┘
```

**Features:**
- Number inputs with up/down arrows
- Min/max validation
- Capacity limits shown below each input

### 3. Payment Method Selection
```
┌──────────────────────────────────────────────────────────┐
│  💰 Payment Method                                       │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ ● Pay Full Amount on Arrival                       │ │
│  │   Pay ₱1,000.00 when you check in                  │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ ○ Pay Reservation Fee (30%)                        │ │
│  │   Pay ₱300.00 now, ₱700.00 on arrival             │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

**Features:**
- Radio button selection
- Bordered cards with hover effect
- Shows exact amounts for each option
- Active selection highlighted

### 4. Booking Summary (Sticky Sidebar)
```
┌─────────────────────────────────────┐
│  Booking Summary                    │
│                                     │
│  🛏️ Room 1                         │
│  Ground Floor                       │
│  ─────────────────────────────────  │
│                                     │
│  Check-in:    Oct 17, 2:00 PM      │
│  Check-out:   Oct 18, 2:00 PM      │
│  Duration:    2 period(s) (12h)    │
│  ─────────────────────────────────  │
│                                     │
│  Guests: 2 Adults, 1 Child         │
│  ─────────────────────────────────  │
│                                     │
│  ₱500.00 × 2 periods    ₱1,000.00  │
│  ═════════════════════════════════  │
│  Total Amount:       ₱1,000.00     │
│                           ^^^^^^^^  │
│  ═════════════════════════════════  │
│                                     │
│  ╔═══════════════════════════════╗ │
│  ║  Reservation Fee (30%)        ║ │
│  ║              ₱300.00          ║ │
│  ║  Balance on Arrival           ║ │
│  ║              ₱700.00          ║ │
│  ╚═══════════════════════════════╝ │
└─────────────────────────────────────┘
```

**Features:**
- Sticky positioning (stays visible while scrolling)
- Room icon and name
- Formatted dates and times
- Guest count summary
- Price calculation breakdown
- Payment breakdown (if reservation fee)
- Brown theme colors throughout

## 📱 Mobile Layout

On mobile devices, the layout stacks vertically:

```
┌─────────────────────────┐
│  Complete Your Booking  │
└─────────────────────────┘

┌─────────────────────────┐
│  📅 Select Dates        │
│  [Check-in Picker]      │
│  [Check-out Picker]     │
└─────────────────────────┘

┌─────────────────────────┐
│  👥 Guests              │
│  Adults:   [2]          │
│  Children: [1]          │
└─────────────────────────┘

┌─────────────────────────┐
│  Special Requests       │
│  [Text Area]            │
└─────────────────────────┘

┌─────────────────────────┐
│  💰 Payment Method      │
│  ○ Full Amount          │
│  ● Reservation Fee      │
└─────────────────────────┘

┌─────────────────────────┐
│  Booking Summary        │
│  Room 1                 │
│  Total: ₱1,000.00      │
└─────────────────────────┘

┌─────────────────────────┐
│  CONFIRM BOOKING        │
└─────────────────────────┘
```

## 🎯 Interactive States

### Button States
```
Normal:     ┌──────────────────┐
            │ Confirm Booking  │
            └──────────────────┘

Hover:      ┌──────────────────┐
            │ Confirm Booking  │ (Darker brown)
            └──────────────────┘

Loading:    ┌──────────────────┐
            │ Creating Booking │ (Spinner)
            └──────────────────┘

Disabled:   ┌──────────────────┐
            │ Confirm Booking  │ (Greyed out)
            └──────────────────┘
```

### Error Display
```
┌────────────────────────────────────────────┐
│  ⚠️ Please select check-in and check-out  │
│     dates                                  │
└────────────────────────────────────────────┘
Red background with border
```

### Payment Radio Buttons
```
Unselected:  ┌──────────────────────────┐
             │ ○ Pay Full Amount        │
             └──────────────────────────┘
             Border: brown-300

Selected:    ┌══════════════════════════┐
             ║ ● Pay Full Amount        ║
             └══════════════════════════┘
             Border: brown-600 (thicker)
```

## 🎨 Color Palette Used

```css
Background:       #fdf8f6  (brown-50)
Card Background:  #ffffff  (white)
Borders:          #eaddd7  (brown-200)
Active Borders:   #e0cec7  (brown-300)
Text Primary:     #43302b  (brown-900)
Text Secondary:   #977669  (brown-700)
Text Muted:       #a18072  (brown-600)
Button BG:        #a18072  (brown-600)
Button Hover:     #977669  (brown-700)
Summary BG:       #f2e8e5  (brown-100)
```

## ✅ Accessibility Features

- ✅ Proper labels for all inputs
- ✅ Keyboard navigation support
- ✅ Focus indicators on interactive elements
- ✅ Error messages clearly visible
- ✅ Sufficient color contrast
- ✅ Semantic HTML structure
- ✅ Screen reader friendly

---

**Status**: ✅ Fully Designed  
**Last Updated**: October 17, 2025
