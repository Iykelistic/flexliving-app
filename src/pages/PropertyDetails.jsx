import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Star, MapPin, Wifi, Car, Coffee, Users, Calendar } from 'lucide-react';

const PropertyDetails = ({ propertyName, onBack }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedReviews();
  }, [propertyName]);

  const fetchApprovedReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3001/api/reviews/approved/${encodeURIComponent(propertyName)}`
      );
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Error fetching approved reviews:', error);
    } finally {
      setLoading(false);
    }
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

  const getPropertyImage = (propertyName) => {
    // Mock property images from Pexels
    const images = {
      "1B SW1 - Premium Covent Garden Apartment": "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800",
      "2B N1 A - 29 Shoreditch Heights": "https://images.pexels.com/photos/2343468/pexels-photo-2343468.jpeg?auto=compress&cs=tinysrgb&w=800",
      "Studio E1 - Modern Canary Wharf": "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800"
    };
    return images[propertyName] || "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800";
  };

  const getPropertyDetails = (propertyName) => {
    const details = {
      "1B SW1 - Premium Covent Garden Apartment": {
        location: "Covent Garden, London",
        price: "£180",
        guests: 2,
        bedrooms: 1,
        bathrooms: 1,
        description: "Luxurious one-bedroom apartment in the heart of Covent Garden, perfect for exploring London's theatre district and shopping areas.",
        amenities: ["Free WiFi", "Kitchen", "Washing Machine", "Heating", "Hair dryer", "Iron"]
      },
      "2B N1 A - 29 Shoreditch Heights": {
        location: "Shoreditch, London", 
        price: "£220",
        guests: 4,
        bedrooms: 2,
        bathrooms: 1,
        description: "Stylish two-bedroom apartment in trendy Shoreditch, close to galleries, restaurants, and vibrant nightlife.",
        amenities: ["Free WiFi", "Kitchen", "Balcony", "Heating", "Washing Machine", "Smart TV"]
      },
      "Studio E1 - Modern Canary Wharf": {
        location: "Canary Wharf, London",
        price: "£160",
        guests: 2,
        bedrooms: 1,
        bathrooms: 1,
        description: "Modern studio in the financial district, ideal for business travelers with excellent transport links.",
        amenities: ["Free WiFi", "Kitchen", "Gym Access", "24/7 Security", "Heating", "Air Conditioning"]
      }
    };
    return details[propertyName] || details["1B SW1 - Premium Covent Garden Apartment"];
  };

  const propertyDetails = getPropertyDetails(propertyName);
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Dashboard</span>
      </button>

      {/* Property Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <img
          src={getPropertyImage(propertyName)}
          alt={propertyName}
          className="w-full h-64 object-cover"
        />
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{propertyName}</h1>
              <div className="flex items-center space-x-2 text-gray-600 mb-3">
                <MapPin className="h-4 w-4" />
                <span>{propertyDetails.location}</span>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {renderStars(Math.round(averageRating))}
                  <span className="text-sm text-gray-600">
                    {averageRating.toFixed(1)} ({reviews.length} reviews)
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">{propertyDetails.price}</p>
              <p className="text-gray-600">per night</p>
            </div>
          </div>

          <p className="text-gray-700 mb-6">{propertyDetails.description}</p>

          {/* Property Info */}
          <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <Users className="h-6 w-6 mx-auto text-gray-600 mb-1" />
              <p className="text-sm text-gray-600">Guests</p>
              <p className="font-semibold">{propertyDetails.guests}</p>
            </div>
            <div className="text-center">
              <Calendar className="h-6 w-6 mx-auto text-gray-600 mb-1" />
              <p className="text-sm text-gray-600">Bedrooms</p>
              <p className="font-semibold">{propertyDetails.bedrooms}</p>
            </div>
            <div className="text-center">
              <Calendar className="h-6 w-6 mx-auto text-gray-600 mb-1" />
              <p className="text-sm text-gray-600">Bathrooms</p>
              <p className="font-semibold">{propertyDetails.bathrooms}</p>
            </div>
            <div className="text-center">
              <Star className="h-6 w-6 mx-auto text-yellow-400 fill-current mb-1" />
              <p className="text-sm text-gray-600">Rating</p>
              <p className="font-semibold">{averageRating.toFixed(1)}</p>
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {propertyDetails.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Guest Reviews</h2>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {renderStars(Math.round(averageRating))}
            </div>
            <span className="text-sm text-gray-600">
              {averageRating.toFixed(1)} • {reviews.length} reviews
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h4 className="font-semibold text-gray-900">{review.guestName}</h4>
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(review.submittedAt).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {review.channel}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-4">{review.publicReview}</p>
                
                {/* Category Ratings */}
                {review.categories && review.categories.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {review.categories.map((category, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg text-center">
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
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No approved reviews yet</h3>
            <p className="text-gray-600">Reviews will appear here once they are approved by managers.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetails;