import React from "react";

export default function ReviewCard({ review, onToggleApprove, readOnly = false }) {
  const {
    id, guestName, publicReview, ratingOverall,
    categories = {}, submittedAt, approved, channel, type
  } = review;

  return (
    <div className="review-card">
      <div className="review-head">
        <div>
          <strong>{guestName || "Guest"}</strong>
          <div className="muted small">{new Date(submittedAt).toLocaleDateString()} • {channel} • {type}</div>
        </div>
        {!readOnly && (
          <label className="chk">
            <input
              type="checkbox"
              checked={approved}
              onChange={e => onToggleApprove(id, e.target.checked)}
            />
            Approved
          </label>
        )}
      </div>
      <p>{publicReview}</p>
      <div className="muted small">
        Overall: {typeof ratingOverall === "number" ? ratingOverall : "—"}
        {" • "}
        {Object.keys(categories).length
          ? `Categories: ${Object.entries(categories).map(([k, v]) => `${k} ${v}`).join(", ")}`
          : "No category breakdown"}
      </div>
    </div>
  );
}
