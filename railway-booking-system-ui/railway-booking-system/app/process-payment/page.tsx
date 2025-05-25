"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/Navbar";

export default function ProcessPaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

  const searchParams = useSearchParams();
  const router = useRouter();

  const userId = Number(searchParams.get("userId")) || 0;
  const bookingId = Number(searchParams.get("bookingId")) || 0;
  const amount = Number(searchParams.get("amount")) || 0;

  const handleLogout = () => router.push("/login");

  const processPayment = async () => {
    try {
      const response = await axios.post("http://localhost:8083/payment/process", {
        userId,
        bookingId,
        amount,
        paymentMethod,
      });

      if (response.data.transactionId) {
        toast.success("Payment Successful: " + response.data.transactionId);
        router.push(`/account?userId=${userId}`);
      } else {
        toast.error("Payment Failed: No transaction ID returned.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Payment Failed: Check console for details.");
    }
  };

  return (
    <div 
      className="min-h-screen p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/pexels-donaldtong94-87737.jpg')" }}
    >

    <Navbar userId={userId}/>
    <div className="max-w-lg mx-auto mt-20 p-6 border rounded-xl shadow-md bg-white">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Process Payment</h2>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>

      <p className="mb-2"><strong>User ID:</strong> {userId}</p>
      <p className="mb-2"><strong>Booking ID:</strong> {bookingId}</p>
      <p className="mb-4"><strong>Amount:</strong> ₹{amount}</p>

      <Select onValueChange={setPaymentMethod} value={paymentMethod}>
        <SelectTrigger><SelectValue placeholder="Select Payment Method" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="UPI">UPI</SelectItem>
          <SelectItem value="Credit Card">Credit Card</SelectItem>
          <SelectItem value="Debit Card">Debit Card</SelectItem>
          <SelectItem value="Net Banking">Net Banking</SelectItem>
        </SelectContent>
      </Select>

      <Button className="w-full mt-4" onClick={processPayment}>Submit Payment</Button>
    </div>
    </div>
  );
}
