const BASE = "http://localhost:3001";

export async function fetchHostawayReviews() {
  const r = await fetch(`${BASE}/api/reviews/hostaway`);
  if (!r.ok) throw new Error("Failed to fetch reviews");
  return r.json();
}

export async function approveReview(reviewId, approved) {
  const r = await fetch(`${BASE}/api/reviews/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reviewId, approved })
  });
  if (!r.ok) throw new Error("Failed to save approval");
  return r.json();
}
