"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const cities = ["Mumbai", "Ahmedabad", "Delhi", "Pune", "Kolkata", "Chennai", "Lucknow", "Bangalore", "Jaipur"];

type Train = {
  id: string;
  trainName: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  cost: number;
};

export default function TrainSearch() {
  const router = useRouter();
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [trains, setTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();

  const userId = Number(searchParams.get("userId")) || 0;
  const username = searchParams.get("username") || "No username found";

  const fetchTrains = async () => {
    setLoading(true);
    setError("");

    try {
      const url = `http://localhost:8082/train/search?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`;
      console.log("Fetching from:", url);

      const response = await fetch(url, { method: "GET", headers: { "Content-Type": "application/json" } });

      if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

      const data: Train[] = await response.json();
      console.log("Fetched Trains:", data);

      setTrains(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch trains. Please check backend logs.");
    }
    setLoading(false);
  };

  const handleViewDetails = (train: Train) => {
    router.push(`/booking?trainId=${train.id}&costPerSeat=${train.cost}&userId=${userId}&username=${encodeURIComponent(username)}`);
  };

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div 
      className="items-center justify-center min-h-screen p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/pexels-donaldtong94-87737.jpg')" }}
    >
      <Navbar userId={userId}/>
    <div className="max-w-xl mx-auto mt-20 p-5 border rounded-xl shadow-md" style={{ backgroundColor: "white" }}>
    <div className="flex justify-between items-center mb-4">
    <h2 className="text-2xl font-bold">Train Search</h2>
    {username === "Admin" && (
      <Button
        variant="default"
        className="ml-2"
        onClick={() => router.push(`/add-train?userId=${userId}`)}
      >
        Add Train
      </Button>
    )}
    <Button variant="outline" onClick={handleLogout}>Logout</Button>
  </div>
      <p className="text-center mb-4"><strong>User ID:</strong> {userId} | <strong>Username:</strong> {username}</p>

      <div className="flex flex-col gap-3">
        <Select onValueChange={setSource}>
          <SelectTrigger><SelectValue placeholder="Select Source" /></SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setDestination}>
          <SelectTrigger><SelectValue placeholder="Select Destination" /></SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={fetchTrains} disabled={loading || !source || !destination}>
          {loading ? <Loader className="animate-spin" /> : "Search Trains"}
        </Button>
      </div>

      {error && <p className="text-red-500 text-center mt-3">{error}</p>}

      <div className="mt-5 space-y-3">
        {trains.map((train) => (
          <Card key={train.id}>
            <CardHeader>
              <CardTitle>{train.trainName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Train Name:</strong> {train.trainName}</p>
              <p><strong>Source:</strong> {train.source}</p>
              <p><strong>Destination:</strong> {train.destination}</p>
              <p><strong>Departure:</strong> {train.departureTime}</p>
              <p><strong>Arrival:</strong> {train.arrivalTime}</p>
              <p><strong>Cost:</strong> ₹{train.cost}</p>
              <Button className="mt-3 w-full" onClick={() => handleViewDetails(train)}>
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    </div>
  );
}
