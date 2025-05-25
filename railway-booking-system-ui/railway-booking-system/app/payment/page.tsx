"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/Navbar";

interface Payment {
  transactionId: string;
  amount: number;
  status: string;
}

export default function PaymentPage() {
  // const [userId, setUserId] = useState("");
  // const [bookingId, setBookingId] = useState("");
  // const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [transactionId, setTransactionId] = useState("");
  const [action, setAction] = useState<"process" | "fetch" | "refund" | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const userId = Number(searchParams.get("userId")) || 0;
  const bookingId = Number(searchParams.get("bookingId")) || 0;
  const amount = Number(searchParams.get("amount")) || 0;
  

  const resetForm = () => {
    // setUserId("");
    // setBookingId("");
    // setAmount("");
    setPaymentMethod("Credit Card");
    setTransactionId("");
    setPayments([]);
    setAction(null);
  };

  const processPayment = async () => {
    try {
      const response = await axios.post("http://localhost:8083/payment/process", {
        userId: Number(userId),
        bookingId: Number(bookingId),
        amount: Number(amount),
        paymentMethod,
      });

      if (response.data.transactionId) {
        toast.success("Payment Successful: " + response.data.transactionId);
        resetForm();
      } else {
        toast.error("Payment Failed: No transaction ID returned.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Payment Failed: Check console for details.");
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await axios.get(`http://localhost:8083/payment/user/${userId}`);
      setPayments(response.data);
      toast.success("Payments fetched successfully!");
    } catch (error) {
      toast.error("Failed to fetch payments.");
    }
  };

  const refundPayment = async () => {
    try {
      const response = await axios.post(`http://localhost:8083/payment/refund/${transactionId}`);
      if (response.data) {
        toast.success("Refund Successful!");
        resetForm();
      } else {
        toast.error("Refund Failed!");
      }
    } catch (error) {
      toast.error("Error processing refund.");
    }
  };

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4 max-w-xl mx-auto mt-10 p-5 border rounded-xl shadow-md">
      <Navbar userId={userId}/>
      <ToastContainer />
      
      {/* Title and Logout Button */}
      <div className="flex justify-between items-center w-full mt-20 mb-4">
        <h2 className="text-2xl font-bold">Payment Portal</h2>
        <Button variant="outline" onClick={handleLogout} className="ml-4">Logout</Button>
      </div>
      
      {/* Buttons for Actions */}
      {!action && (
        <div className="flex flex-col space-y-4 w-full">
          <Button onClick={() => setAction("process")} className="w-full">Process Payment</Button>
          <Button onClick={() => setAction("fetch")} className="w-full">Fetch Payments</Button>
          <Button onClick={() => setAction("refund")} className="w-full">Refund Payment</Button>
        </div>
      )}

      {/* Process Payment Form */}
      {action === "process" && (
        <Card className="w-full p-4">
          <CardContent>
            <div className="mb-4">
              <p className="text-lg font-semibold">User ID: {userId}</p>
            </div>
            <div className="mb-4">
              <p className="text-lg font-semibold">Booking ID: {bookingId}</p>
            </div>
            <div className="mb-4">
              <p className="text-lg font-semibold">Amount: {amount}</p>
            </div>
            <Select onValueChange={setPaymentMethod} value={paymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="Debit Card">Debit Card</SelectItem>
                <SelectItem value="Net Banking">Net Banking</SelectItem>
              </SelectContent>
            </Select>
            <Button className="w-full mt-2" onClick={processPayment}>Submit Payment</Button>
            <Button className="w-full mt-2 bg-red-500" onClick={resetForm}>Cancel</Button>
          </CardContent>
        </Card>
      )}

      {/* Fetch Payments */}
      {action === "fetch" && (
        <div className="w-full">
          <div className="mb-4">
            <p className="text-lg font-semibold">User ID: {userId}</p>
          </div>
          <Button onClick={fetchPayments} className="w-full mt-2">Fetch Payments</Button>
          <Button className="w-full mt-2 bg-red-500" onClick={resetForm}>Cancel</Button>
          <div className="w-full mt-4">
            {payments.length > 0 ? (
              payments.map((payment) => (
                <Card key={payment.transactionId} className="mt-2 p-2">
                  <CardContent>
                    <p>Transaction ID: {payment.transactionId}</p>
                    <p>Amount: {payment.amount}</p>
                    <p>Status: {payment.status}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-500">No payments found.</p>
            )}
          </div>
        </div>
      )}

      {/* Refund Payment Form */}
      {action === "refund" && (
        <Card className="w-full p-4">
          <CardContent>
            <Input placeholder="Transaction ID" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
            <Button className="w-full mt-2" onClick={refundPayment}>Refund Payment</Button>
            <Button className="w-full mt-2 bg-red-500" onClick={resetForm}>Cancel</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}