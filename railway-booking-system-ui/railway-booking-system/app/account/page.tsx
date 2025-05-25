"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Navbar from "@/components/Navbar";

interface Payment {
  transactionId: string;
  amount: number;
  status: string;
}

interface User {
  id: number;
  email: string;
  username: string;
}

export default function AccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = Number(searchParams.get("userId")) || 0;

  const [user, setUser] = useState<User | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);

  const handleLogout = () => router.push("/login");

  useEffect(() => {
    const fetchUserAndPayments = async () => {
      try {
        const [userRes, paymentsRes] = await Promise.all([
          axios.get(`http://localhost:8081/user/id/${userId}`),
          axios.get(`http://localhost:8083/payment/user/${userId}`),
        ]);
        setUser(userRes.data);
        setPayments(paymentsRes.data);
      } catch (err) {
        toast.error("Error fetching user or payments.");
      }
    };

    fetchUserAndPayments();
  }, [userId]);

  const refundPayment = async (transactionId: string) => {
    try {
      const response = await axios.post(`http://localhost:8083/payment/refund/${transactionId}`);
      if (response.data) {
        toast.success("Refund Successful!");
        setPayments((prev) => prev.map((p) =>
          p.transactionId === transactionId ? { ...p, status: "REFUNDED" } : p
        ));
      } else {
        toast.error("Refund Failed!");
      }
    } catch (error) {
      toast.error("Error processing refund.");
    }
  };

  return (
    <div 
      className="min-h-screen p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/pexels-donaldtong94-87737.jpg')" }}
    >
      <Navbar userId={userId}/>
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 mt-20 border rounded-xl shadow-md ">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Hello, {user?.username}</h2>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>

      {user && (
        <div className="mb-4">
          <p><strong>User ID:</strong> {user.id}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}

      <h3 className="text-lg font-semibold mt-6 mb-3">Payment History</h3>
      {payments.length > 0 ? (
        payments.map((payment) => (
          <Card key={payment.transactionId} className="mb-3">
            <CardContent className="py-4 space-y-2">
              <p><strong>Transaction ID:</strong> {payment.transactionId}</p>
              <p><strong>Amount:</strong> ₹{payment.amount}</p>
              <p><strong>Status:</strong> {payment.status}</p>
              {payment.status !== "REFUNDED" && (
                <Button
                  variant="destructive"
                  onClick={() => refundPayment(payment.transactionId)}
                >
                  Refund
                </Button>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-gray-500">No payments found.</p>
      )}
    </div>
    </div>
  );
}
