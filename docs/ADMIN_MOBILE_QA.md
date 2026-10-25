# Admin ↔ Mobile QA matrix

Run after deploying Cloud Functions and refreshing the admin panel.

| Admin action | Firestore signal | Mobile verify |
| --- | --- | --- |
| Approve listing | `items.status=approved` | Item on Discover; propose swap enabled |
| Hide listing | `items.status=hidden` | Gone from Discover; My Items → Hidden |
| Request edit | `pending` + `flagMessage` / `edit_requested` | My Items → Active shows moderation banner |
| Reject listing | `items.status=rejected` | My Items → Rejected tab + note |
| Restrict user | `users.accountStatus=restricted` | Listing publish / swap / chat blocked with message |
| Ban user | `accountStatus=banned`, `banNote` | Profile ban banner; actions blocked |
| Lift restriction | `active`, restriction cleared | Listing and swap work again |
| Close report | `reports.status=closed` | (Reporter UI optional) |
| Plan save | `settings/subscriptionPlans` | Choose Plan loads tiers from Firebase |
| Moderation notify | `notifications` doc for `ownerId` | Notifications screen lists entry |

## Smoke steps

1. Post item from mobile → appears in Items Review as pending.
2. Approve in admin → appears on Discover within stream refresh.
3. Report item from mobile → report in admin with `targetId`; item flagged.
4. Request edit → owner sees banner on My Items.
5. Restrict test user → cannot send chat or publish.
