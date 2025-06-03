"use client";

import React, { useEffect } from "react";
import { MemoryFilters } from "@/app/memories/components/MemoryFilters";
import { MemoriesSection } from "@/app/memories/components/MemoriesSection";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUserId } from "@/store/profileSlice";

export default function MemoriesPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const userId = params.userId as string;

  useEffect(() => {
    if (userId) {
      dispatch(setUserId(userId));
    }
  }, [userId, dispatch]);

  return (
    <div className="w-full mx-auto py-6 text-white">
      <div className="container">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Memories</h1>
            <p className="text-gray-400">
              View and manage all your memories in one place
            </p>
          </div>

          <MemoryFilters />

          <MemoriesSection />
        </div>
      </div>
    </div>
  );
}