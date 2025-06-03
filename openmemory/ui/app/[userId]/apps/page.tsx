"use client";

import React, { useEffect } from 'react';
import { AppGrid } from '@/app/apps/components/AppGrid';
import { AppFilters } from '@/app/apps/components/AppFilters';
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUserId } from "@/store/profileSlice";

export default function AppsPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const userId = params.userId as string;

  useEffect(() => {
    if (userId) {
      dispatch(setUserId(userId));
    }
  }, [userId, dispatch]);

  return (
    <div className="w-full mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Connected Apps</h1>
          <p className="text-gray-400">
            View all the applications connected to your Open Memory
          </p>
        </div>
        
        <AppFilters />
        
        <AppGrid />
      </div>
    </div>
  );
}