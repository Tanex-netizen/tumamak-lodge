# Guest Chat Implementation Plan

## Backend Changes
- [x] Add new public endpoint `GET /api/contact-messages/public/:id` in `contactMessageController.js`
- [x] Update `contactMessageRoutes.js` to include the new public route

## Frontend Changes
- [x] Modify `FloatingChat.jsx` to add guest form (name, email, phone)
- [x] Store conversation ID in localStorage after first message
- [x] Fetch and display messages for guests using stored ID
- [x] Handle polling for new messages for guests
- [x] Update UI to show guest chat interface

## Testing
- [ ] Test guest chat functionality
- [ ] Verify messages are sent and received
- [ ] Check conversation history for guests
- [ ] Handle edge cases (multiple conversations with same email)
