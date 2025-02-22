'use client';
import React, { useEffect, useState } from "react";

interface FitnessData {
  goals: {
    activeMinutes: number;
    caloriesOut: number;
    distance: number;
    floors: number;
    steps: number;
  };
  summary: {
    activityCalories: number;
    caloriesBMR: number;
    caloriesOut: number;
    distances: Record<string, number>;
    fairlyActiveMinutes: number;
    lightlyActiveMinutes: number;
    sedentaryMinutes: number;
    steps: number;
    veryActiveMinutes: number;
  };
}

const FitnessDataComponent: React.FC = () => {
  const [data, setFitnessData] = useState<FitnessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5111/getdata");

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch data");
        }

        const data: FitnessData = await response.json();
        setFitnessData(data);
        console.log(data)
      } catch (err: any) {
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Fitness Tracker</h1>
      
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Goals</h2>
        <div className="grid grid-cols-2 gap-4 text-gray-600">
          <div>Active Minutes: <span className="font-bold">{data.goals.activeMinutes} mins</span></div>
          <div>Calories Out: <span className="font-bold">{data.goals.caloriesOut} kcal</span></div>
          <div>Distance: <span className="font-bold">{data.goals.distance} km</span></div>
          <div>Floors: <span className="font-bold">{data.goals.floors}</span></div>
          <div>Steps: <span className="font-bold">{data.goals.steps}</span></div>
        </div>
      </div>

      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Summary</h2>
        <div className="grid grid-cols-2 gap-4 text-gray-600">
          <div>Activity Calories: <span className="font-bold">{data.summary.activityCalories} kcal</span></div>
          <div>Calories BMR: <span className="font-bold">{data.summary.caloriesBMR} kcal</span></div>
          <div>Calories Out: <span className="font-bold">{data.summary.caloriesOut} kcal</span></div>
          <div>Steps: <span className="font-bold">{data.summary.steps}</span></div>
          <div>Very Active Minutes: <span className="font-bold">{data.summary.veryActiveMinutes} mins</span></div>
          <div>Fairly Active Minutes: <span className="font-bold">{data.summary.fairlyActiveMinutes} mins</span></div>
          <div>Lightly Active Minutes: <span className="font-bold">{data.summary.lightlyActiveMinutes} mins</span></div>
          <div>Sedentary Minutes: <span className="font-bold">{data.summary.sedentaryMinutes} mins</span></div>
        </div>
      </div>

      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Distances</h2>
        <ul className="text-gray-600">
          {Object.entries(data.summary.distances).map(([activity, distance]) => (
            <li key={activity} className="mb-2">
              {activity}: <span className="font-bold">{distance.toFixed(2)} km</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FitnessDataComponent;
