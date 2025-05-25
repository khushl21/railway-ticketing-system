"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddTrainPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const userId = searchParams.get("userId");
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");

  const [formData, setFormData] = useState({
    trainName: "",
    trainNumber: "",
    source: "",
    destination: "",
    departureTime: "",
    arrivalTime: "",
    cost: "",
    totalSeats: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:8081/user/id/${userId}`);
        const user = await response.json();

        if (
          user.username === "Admin" &&
          user.email === "thisisadmin@admin.com" &&
          user.password === "admin@123$567"
        ) {
          setIsAdmin(true);
          setUsername(user.username);
        } else {
          router.push("/unauthorized");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/unauthorized");
      }
    };

    if (userId) fetchUser();
  }, [userId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { trainName, trainNumber, source, destination, departureTime, arrivalTime, cost, totalSeats } = formData;

    if (!trainName || !trainNumber || !source || !destination || !departureTime || !arrivalTime || !cost || !totalSeats) {
      alert("All fields are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8082/train/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, cost: parseFloat(formData.cost) }),
      });

      if (!response.ok) throw new Error("Failed to add train");

      alert("Train added successfully!");
      router.push(`/train-detail?userId=${userId}&username=${encodeURIComponent(username)}`);
    } catch (err) {
      console.error(err);
      alert("Failed to add train");
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/pexels-donaldtong94-87737.jpg')" }}>
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Add Train</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input name="trainName" placeholder="Train Name" onChange={handleChange} required />
          <Input name="trainNumber" placeholder="Train Number" onChange={handleChange} required />
          <Input name="source" placeholder="Source" onChange={handleChange} required />
          <Input name="destination" placeholder="Destination" onChange={handleChange} required />
          <Input name="departureTime" type="time" onChange={handleChange} required />
          <Input name="arrivalTime" type="time" onChange={handleChange} required />
          <Input name="cost" placeholder="Cost" type="number" onChange={handleChange} required />
          <Input name="totalSeats" placeholder="Total Seats" type="number" onChange={handleChange} required />
          <Button className="w-full" onClick={handleSubmit}>Submit</Button>
        </CardContent>
      </Card>
    </div>
  );
}
