import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getEvents } from "../services/events";
import EventCard from "../components/EventCard";
import Loading from "../components/Loading";

const HomePage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents({
          status: "published",
          sort: "dateDesc",
          limit: 6,
        });
        setFeaturedEvents(data);
      } catch (err) {
        setError("Failed to fetch events");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover and Book Amazing Events
          </h1>
          <p className="text-xl mb-8">
            Find the best events near you and book tickets in minutes
          </p>
          <Link
            to="/events"
            className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Browse Events
          </Link>
        </div>
      </div>

      {/* Featured Events */}
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Events</h2>
          <Link to="/events" className="text-blue-600 hover:underline">
            View All
          </Link>
        </div>

        {error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : featuredEvents.length === 0 ? (
          <div className="text-gray-500 text-center">No events available</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="bg-gray-200 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Events</h3>
              <p className="text-gray-600">
                Explore upcoming events based on your interests and location
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Select Tickets</h3>
              <p className="text-gray-600">
                Choose from different ticket types and add them to your cart
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">
                Complete your purchase with our secure payment system
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
