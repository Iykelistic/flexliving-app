# 📄 Flex Living Reviews Dashboard – Documentation  

## 🔹 1. Running Version / Local Setup Instructions  

### Prerequisites
- Node.js (>= 18)  
- npm or yarn  

### Steps
1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd flexliving-app
Install dependencies

Backend:
cd server
npm install

Frontend:
cd root folder
npm install

Environment variables
Create a .env file inside /server with:

PORT=3001


Start backend
cd server
npm start
Server runs at: http://localhost:3001

Start frontend
cd root folder
npm start
Frontend runs at: http://localhost:3000

🔹 2. Tech Stack Used
Frontend: React (Create React App), TailwindCSS, React Router

Backend: Node.js + Express.js

Storage: Simple JSON file persistence for approvals

Integration:

Hostaway API (mocked + sandboxed)

🔹 3. Key Design and Logic Decisions
Data Normalization

Hostaway reviews contain nested ratings and categories.

Implemented to transform reviews into a consistent shape:

json

{
  "id": "123",
  "listingName": "Shoreditch Heights",
  "guestName": "John Doe",
  "rating": 8,
  "categories": { "cleanliness": 10, "communication": 9 },
  "reviewText": "Great stay!",
  "submittedAt": "2020-08-21",
  "approved": true
}
Approval Flow

Managers can approve/unapprove reviews.

Approvals stored in a lightweight JSON file (approvalStore.json).

Dashboard UX

Filter by reviews, rating, status, channels.

Highlights recurring low-score categories.

Public property pages only display approved reviews.

Fallback Resilience

Since Hostaway sandbox often has no real reviews, app falls back to mock JSON for demo/testing.

🔹 4. API Behaviors
GET /api/reviews/hostaway
Returns normalized reviews (from Hostaway or mock).
Response Example:
json

{
  "status": "success",
  "channel": "hostaway",
  "updatedAt": "2025-08-23T12:34:56Z",
  "reviews": [
    {
      "id": "7453",
      "listingName": "Shoreditch Heights",
      "guestName": "Shane",
      "rating": 10,
      "categories": { "cleanliness": 10, "communication": 10 },
      "reviewText": "Would definitely host again",
      "approved": true
    }
  ]
}
POST /api/reviews/approve
Marks a review as approved/unapproved.
Request:

json
{ "reviewId": "7453", "approved": true }
🔹 5. Google Reviews Findings
Exploration: Looked into using Google Places API to fetch external guest reviews.

Requirements: Billing-enabled Google Cloud account and placeId for each property.

Limitations:

Google only returns ~5 most recent reviews.

Mapping Flex Living properties to placeId would require an additional Places Search API integration.

Decision: Not implemented in this version. Findings documented for potential future work.

✅ This project delivers a manager dashboard + review display flow that allows Flex Living to control guest reviews for public visibility, while keeping the architecture extendable for future integrations like Google Reviews.