import express from 'express';
import cors from 'cors';
import axios from 'axios';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock review data to supplement the sandboxed API
const mockReviews = [
  {
    id: 1001,
    type: "guest-to-host",
    status: "published",
    rating: 5,
    publicReview: "Amazing property! The location was perfect and the amenities were top-notch. Shane was very responsive and helpful throughout our stay.",
    reviewCategory: [
      { category: "cleanliness", rating: 5 },
      { category: "communication", rating: 5 },
      { category: "location", rating: 5 },
      { category: "value", rating: 4 }
    ],
    submittedAt: "2024-01-15 14:30:22",
    guestName: "Emma Johnson",
    listingName: "1B SW1 - Premium Covent Garden Apartment",
    channel: "Airbnb",
    approved: true
  },
  {
    id: 1002,
    type: "guest-to-host", 
    status: "published",
    rating: 4,
    publicReview: "Great stay overall. The apartment was clean and well-equipped. Only minor issue was the heating took a while to warm up.",
    reviewCategory: [
      { category: "cleanliness", rating: 5 },
      { category: "communication", rating: 4 },
      { category: "location", rating: 4 },
      { category: "value", rating: 4 }
    ],
    submittedAt: "2024-01-18 09:15:33",
    guestName: "Michael Chen",
    listingName: "1B SW1 - Premium Covent Garden Apartment",
    channel: "Booking.com",
    approved: false
  },
  {
    id: 1003,
    type: "guest-to-host",
    status: "published", 
    rating: 5,
    publicReview: "Exceptional experience! The Shoreditch location was perfect for exploring London. The apartment exceeded our expectations.",
    reviewCategory: [
      { category: "cleanliness", rating: 5 },
      { category: "communication", rating: 5 },
      { category: "location", rating: 5 },
      { category: "value", rating: 5 }
    ],
    submittedAt: "2024-01-20 16:45:12",
    guestName: "Sarah Williams",
    listingName: "2B N1 A - 29 Shoreditch Heights",
    channel: "Airbnb",
    approved: true
  },
  {
    id: 1004,
    type: "guest-to-host",
    status: "published",
    rating: 3,
    publicReview: "Decent apartment but had some issues with WiFi connectivity. Location was good though.",
    reviewCategory: [
      { category: "cleanliness", rating: 4 },
      { category: "communication", rating: 3 },
      { category: "location", rating: 4 },
      { category: "value", rating: 3 }
    ],
    submittedAt: "2024-01-22 11:20:45",
    guestName: "David Rodriguez",
    listingName: "Studio E1 - Modern Canary Wharf",
    channel: "Expedia",
    approved: false
  },
  {
    id: 1005,
    type: "guest-to-host",
    status: "published",
    rating: 5,
    publicReview: "Perfect for our business trip! Everything was spotless and the location couldn't be better for accessing the financial district.",
    reviewCategory: [
      { category: "cleanliness", rating: 5 },
      { category: "communication", rating: 5 },
      { category: "location", rating: 5 },
      { category: "value", rating: 4 }
    ],
    submittedAt: "2024-01-25 13:55:18",
    guestName: "Lisa Thompson",
    listingName: "Studio E1 - Modern Canary Wharf",
    channel: "Airbnb",
    approved: true
  }
];

// Hostaway API configuration
const HOSTAWAY_CONFIG = {
  accountId: '61148',
  apiKey: 'f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152',
  baseUrl: 'https://api.hostfully.com/v2'
};

// Normalize review data function
function normalizeReview(review) {
  return {
    id: review.id,
    type: review.type,
    status: review.status,
    rating: review.rating || calculateAverageRating(review.reviewCategory),
    publicReview: review.publicReview,
    categories: review.reviewCategory || [],
    submittedAt: review.submittedAt,
    guestName: review.guestName,
    listingName: review.listingName,
    channel: review.channel || 'Hostaway',
    approved: review.approved !== undefined ? review.approved : false,
    averageRating: calculateAverageRating(review.reviewCategory)
  };
}

function calculateAverageRating(categories) {
  if (!categories || categories.length === 0) return 0;
  const sum = categories.reduce((acc, cat) => acc + (cat.rating || 0), 0);
  return Math.round((sum / categories.length) * 10) / 10;
}

// API Routes
app.get('/api/reviews/hostaway', async (req, res) => {
  try {
    console.log('Fetching reviews from Hostaway API...');
    
    // Try to fetch from Hostaway API first
    let hostawayReviews = [];
    try {
      const response = await axios.get(`${HOSTAWAY_CONFIG.baseUrl}/reviews`, {
        headers: {
          'Authorization': `Bearer ${HOSTAWAY_CONFIG.apiKey}`,
          'Content-Type': 'application/json'
        },
        params: {
          accountId: HOSTAWAY_CONFIG.accountId
        }
      });
      
      if (response.data && response.data.result) {
        hostawayReviews = response.data.result;
      }
    } catch (apiError) {
      console.log('Hostaway API returned no data (expected for sandbox), using mock data');
    }
    
    // Combine API data with mock data
    const allReviews = [...hostawayReviews, ...mockReviews];
    
    // Normalize all reviews
    const normalizedReviews = allReviews.map(normalizeReview);
    
    res.json({
      status: 'success',
      count: normalizedReviews.length,
      reviews: normalizedReviews
    });
    
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
});

// Update review approval status
app.put('/api/reviews/:id/approval', (req, res) => {
  const reviewId = parseInt(req.params.id);
  const { approved } = req.body;
  
  // Find and update the mock review
  const reviewIndex = mockReviews.findIndex(review => review.id === reviewId);
  if (reviewIndex !== -1) {
    mockReviews[reviewIndex].approved = approved;
    res.json({
      status: 'success',
      message: `Review ${approved ? 'approved' : 'unapproved'} successfully`
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: 'Review not found'
    });
  }
});

// Get approved reviews for a specific property
app.get('/api/reviews/approved/:listingName', (req, res) => {
  const listingName = decodeURIComponent(req.params.listingName);
  
  const approvedReviews = mockReviews
    .filter(review => review.listingName === listingName && review.approved)
    .map(normalizeReview);
    
  res.json({
    status: 'success',
    count: approvedReviews.length,
    reviews: approvedReviews
  });
});

// Get analytics data
app.get('/api/analytics/overview', (req, res) => {
  const allReviews = mockReviews.map(normalizeReview);
  
  const analytics = {
    totalReviews: allReviews.length,
    averageRating: allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length,
    approvedReviews: allReviews.filter(review => review.approved).length,
    pendingReviews: allReviews.filter(review => !review.approved).length,
    ratingDistribution: {
      5: allReviews.filter(r => r.rating === 5).length,
      4: allReviews.filter(r => r.rating === 4).length,
      3: allReviews.filter(r => r.rating === 3).length,
      2: allReviews.filter(r => r.rating === 2).length,
      1: allReviews.filter(r => r.rating === 1).length,
    },
    channelBreakdown: allReviews.reduce((acc, review) => {
      acc[review.channel] = (acc[review.channel] || 0) + 1;
      return acc;
    }, {}),
    propertyPerformance: allReviews.reduce((acc, review) => {
      if (!acc[review.listingName]) {
        acc[review.listingName] = {
          totalReviews: 0,
          averageRating: 0,
          approved: 0
        };
      }
      acc[review.listingName].totalReviews++;
      acc[review.listingName].averageRating = ((acc[review.listingName].averageRating * (acc[review.listingName].totalReviews - 1)) + review.rating) / acc[review.listingName].totalReviews;
      if (review.approved) acc[review.listingName].approved++;
      return acc;
    }, {})
  };
  
  res.json(analytics);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});