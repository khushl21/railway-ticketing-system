"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import axios from "axios"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
export default function SignupPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8081/user/register", data);
      toast.success("User registered successfully!");
      reset();
      router.push("/login");
    } catch (error) {
      toast.error("Registration failed! Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 bg-cover bg-center" style={{ backgroundImage: "url('/images/pexels-donaldtong94-87737.jpg')" }}>
      <ToastContainer />
      <Card className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <CardContent>
          <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <div>
              <Label className="mb-2 block">Username</Label>
              <Input
                type="text"
                {...register("username", {
                  required: "Username is required",
                  minLength: { value: 3, message: "Username must be at least 3 characters" },
                  maxLength: { value: 20, message: "Username must not exceed 20 characters" },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: "Username can only contain letters, numbers, and underscores"
                  }
                })}
              />
              {errors.username && <p className="text-red-500 text-sm">{errors.username.message as string}</p>}
            </div>

            {/* Email */}
            <div>
              <Label className="mb-2 block">Email</Label>
              <Input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address"
                  }
                })}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message as string}</p>}
            </div>

            {/* Password */}
            <div>
              <Label className="mb-2 block">Password</Label>
              <Input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
                    message: "Password must include letters and numbers"
                  }
                })}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message as string}</p>}
            </div>


            {/* Submit Button */}
            <link rel="stylesheet" href="/train-detail" />
            <Button type="submit" className="w-full mt-4" disabled={loading}>
            
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
            
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
