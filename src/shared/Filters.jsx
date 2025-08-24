import React from "react";

export default function Filters({
  listings, selectedListing, setSelectedListing,
  ratingMin, setRatingMin,
  category, setCategory, categories,
  channel, setChannel,
  timeFrom, setTimeFrom,
  approvedOnly, setApprovedOnly
}) {
  return (
    <div className="filters">
      <label>
        Listing
        <select value={selectedListing} onChange={e => setSelectedListing(e.target.value)}>
          {listings.map(l => (
            <option key={l.listingId} value={l.listingId}>{l.listingName}</option>
          ))}
        </select>
      </label>

      <label>
        Min Rating
        <input type="number" min="0" max="10" step="0.1"
          value={ratingMin} onChange={e => setRatingMin(e.target.value)} placeholder="e.g. 8.5" />
      </label>

      <label>
        Category
        <select value={category} onChange={e => setCategory(e.target.value)}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>

      <label>
        Channel
        <select value={channel} onChange={e => setChannel(e.target.value)}>
          {["all", "hostaway", "google"].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>

      <label>
        From date
        <input type="date" value={timeFrom} onChange={e => setTimeFrom(e.target.value)} />
      </label>

      <label className="chk">
        <input type="checkbox" checked={approvedOnly} onChange={e => setApprovedOnly(e.target.checked)} />
        Approved only
      </label>
    </div>
  );
}
