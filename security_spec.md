# Security Specification for Firestore

## Data Invariants
1. All user data (transactions, proofs) MUST be strictly contained under `/users/{userId}`.
2. Only the authenticated user owning the `userId` can read or write their own documents.
3. Admins have access to list and validate all proofs.

## The "Dirty Dozen" Payloads
1. `POST /users/otherUserId/transactions`: Write to another user's transaction.
2. `GET /users/otherUserId/transactions`: Read another user's transaction.
3. `POST /users/{userId}/transactions`: Transaction with amount -100.
4. `PATCH /users/{userId}/transactions/{id}`: Set status to "approved" (user-side).
5. `POST /users/{userId}/proofs`: Proof with non-string `proofName`.
6. `POST /users/{userId}`: Set `isAdmin: true` in user profile.
7. `POST /users/{userId}/transactions`: Client-provided `createdAt` in the future.
8. `POST /users/{userId}/transactions`: Payload with extra 'ghostField'.
9. `GET /users/otherUserId`: Try to read another user's profile.
10. `POST /users/INVALID_ID/transactions`: Injection attack on path.
11. `PATCH /users/{userId}/transactions/{id}`: Attempt to change `userId` inside transaction body.
12. `POST /users/{userId}/transactions`: Payload with 1MB string in `type`.
