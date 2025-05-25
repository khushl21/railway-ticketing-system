"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/Navbar";

const BookingPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const trainId = searchParams.get("trainId");
  const costPerSeat = Number(searchParams.get("costPerSeat")) || 0;
  const userId = Number(searchParams.get("userId")) || 0;
  const username = searchParams.get("username") || "No username found";

  const [name, setName] = useState("");
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [totalAmount, setTotalAmount] = useState(costPerSeat);
  const [paymentStatus, setPaymentStatus] = useState("PENDING");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setTotalAmount(numberOfSeats * costPerSeat);
  }, [numberOfSeats, costPerSeat]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainId) {
      setError("Train ID not found!");
      return;
    }

    const bookingData = {
      trainId,
      userId: 1, // Assuming userId is 1 for now or replace with actual logic
      bookingDate: new Date(),
      numberOfSeats,
      totalAmount,
      paymentStatus: "SUCCESS",
    };

    setIsSubmitting(true);
    setError(""); // Reset error before submitting

    let data: any = null;

    try {
      const response = await fetch("http://localhost:8084/booking/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Booking failed! Please try again.");
        return;
      }

      data = await response.json();
      if (data) {
        
        // Navigate to booking success page after booking is successful
        router.push(`/process-payment?userId=${userId}&bookingId=${data.id}&amount=${totalAmount}`);
      }
    } catch (err) {
      console.error("Booking error:", err);
      setError(`An error occurred while booking. Please try again. Booking Data: ${JSON.stringify(bookingData)}. Server Response: ${JSON.stringify(data)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div className="items-center justify-center min-h-screen p-4 bg-cover bg-center" style={{ backgroundImage: "url('/images/pexels-donaldtong94-87737.jpg')"}}>
      <Navbar userId={userId}/>
  <div className="max-w-xl mx-auto mt-20 p-5 border rounded-xl shadow-md bg-white shadow-lg rounded-md">
      <div className="max-w-xl flex mx-auto justify-between items-center mb-4">
    <h2 className="text-2xl font-bold">Train Booking</h2>
    <Button variant="outline" onClick={handleLogout}>Logout</Button>
  </div>
      {/* <h2 className="text-2xl font-semibold mb-4">Train Booking</h2>
      <Button className="mt-4" onClick={handleLogout}>Logout</Button> */}
        <h3 className="text-lg font-semibold mb-2">Train ID: {trainId}</h3>
        <h3 className="text-lg font-semibold mb-4">Cost per Seat: ₹{costPerSeat}</h3>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
            <div className="mb-4">
            <p className="text-lg font-semibold">{username}</p>
          </div>
          </div>

          <div className="mb-4">
            <label htmlFor="numberOfSeats" className="block text-sm font-medium text-gray-700">Number of Seats</label>
            <input
              type="number"
              id="numberOfSeats"
              value={numberOfSeats}
              onChange={(e) => setNumberOfSeats(Number(e.target.value))}
              required
              min="1"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          <div className="mb-4">
            <p className="text-lg font-semibold">Total Amount: ₹{totalAmount}</p>
          </div>

          {/* <div className="mb-4">
            <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700">Payment Status</label>
            <select
              id="paymentStatus"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            >
              <option value="PENDING">PENDING</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div> */}

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white p-2 rounded-md ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;
