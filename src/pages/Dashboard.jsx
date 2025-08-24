import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Star, 
  TrendingUp, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Filter,
  Search,
  Eye,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

const Dashboard = ({ onViewProperty }) => {
  const [reviews, setReviews] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    rating: '',
    channel: '',
    approved: '',
    search: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reviewsResponse, analyticsResponse] = await Promise.all([
        axios.get('http://localhost:3001/api/reviews/hostaway'),
        axios.get('http://localhost:3001/api/analytics/overview')
      ]);
      
      setReviews(reviewsResponse.data.reviews);
      setAnalytics(analyticsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalToggle = async (reviewId, currentStatus) => {
    try {
      await axios.put(`http://localhost:3001/api/reviews/${reviewId}/approval`, {
        approved: !currentStatus
      });
      
      // Update local state
      setReviews(prevReviews =>
        prevReviews.map(review =>
          review.id === reviewId 
            ? { ...review, approved: !currentStatus }
            : review
        )
      );
      
      // Refresh analytics
      fetchData();
    } catch (error) {
      console.error('Error updating approval status:', error);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesRating = !filters.rating || review.rating === parseInt(filters.rating);
    const matchesChannel = !filters.channel || review.channel === filters.channel;
    const matchesApproved = filters.approved === '' || 
      (filters.approved === 'true' && review.approved) ||
      (filters.approved === 'false' && !review.approved);
    const matchesSearch = !filters.search || 
      review.listingName.toLowerCase().includes(filters.search.toLowerCase()) ||
      review.guestName.toLowerCase().includes(filters.search.toLowerCase()) ||
      review.publicReview.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesRating && matchesChannel && matchesApproved && matchesSearch;
  });

  const getUniqueChannels = () => {
    return [...new Set(reviews.map(review => review.channel))];
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.totalReviews}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-3xl font-bold text-gray-900">
                  {analytics.averageRating.toFixed(1)}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500 fill-current" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-green-600">{analytics.approvedReviews}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-orange-600">{analytics.pendingReviews}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>
      )}

      {/* Property Performance */}
      {analytics && analytics.propertyPerformance && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Property Performance</h2>
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(analytics.propertyPerformance).map(([propertyName, data]) => (
              <div key={propertyName} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-medium text-gray-900 text-sm leading-tight">{propertyName}</h3>
                  <button
                    onClick={() => onViewProperty(propertyName)}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Reviews</span>
                    <span className="font-semibold">{data.totalReviews}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg Rating</span>
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold">{data.averageRating.toFixed(1)}</span>
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Approved</span>
                    <span className="font-semibold text-green-600">{data.approved}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Reviews Management</h2>
          <Filter className="h-6 w-6 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filters.rating}
            onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          
          <select
            value={filters.channel}
            onChange={(e) => setFilters(prev => ({ ...prev, channel: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Channels</option>
            {getUniqueChannels().map(channel => (
              <option key={channel} value={channel}>{channel}</option>
            ))}
          </select>
          
          <select
            value={filters.approved}
            onChange={(e) => setFilters(prev => ({ ...prev, approved: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="true">Approved</option>
            <option value="false">Pending</option>
          </select>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map(review => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{review.guestName}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {review.channel}
                    </span>
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-600">({review.rating})</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{review.listingName}</p>
                  <p className="text-gray-700 mb-3">{review.publicReview}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(review.submittedAt).toLocaleDateString('en-GB', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    review.approved 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {review.approved ? 'Approved' : 'Pending'}
                  </span>
                  
                  <button
                    onClick={() => handleApprovalToggle(review.id, review.approved)}
                    className={`p-2 rounded-lg transition-colors ${
                      review.approved
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={review.approved ? 'Remove approval' : 'Approve review'}
                  >
                    {review.approved ? (
                      <ThumbsDown className="h-4 w-4" />
                    ) : (
                      <ThumbsUp className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Category Ratings */}
              {review.categories && review.categories.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
                  {review.categories.map((category, index) => (
                    <div key={index} className="text-center">
                      <p className="text-xs text-gray-600 capitalize mb-1">
                        {category.category.replace('_', ' ')}
                      </p>
                      <div className="flex items-center justify-center space-x-1">
                        <span className="font-semibold text-sm">{category.rating}</span>
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;