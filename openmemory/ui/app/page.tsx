"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "@/styles/animation.css";

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  
  // Check if there's a default user ID from environment
  const defaultUserId = process.env.NEXT_PUBLIC_USER_ID;
  
  useEffect(() => {
    // If there's a default user ID, redirect immediately
    if (defaultUserId) {
      router.push(`/${defaultUserId}`);
    }
  }, [defaultUserId, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId.trim()) {
      router.push(`/${userId.trim()}`);
    }
  };

  // If there's a default user, show loading while redirecting
  if (defaultUserId) {
    return (
      <div className="text-white py-6">
        <div className="container flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-lg">Redirecting to user dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white py-6">
      <div className="container flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome to OpenMemory</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="userId" className="block text-sm font-medium text-zinc-400 mb-2">
                  Enter User ID to continue
                </label>
                <Input
                  id="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="e.g., john_doe"
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={!userId.trim()}
              >
                Continue
              </Button>
            </form>
            <div className="mt-4 text-sm text-zinc-500 text-center">
              <p>Enter any user ID to view their memories</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
