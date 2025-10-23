// src/api/habits.ts
import api from "./client";

export const getHabits = async () => {
  const res = await api.get("/habits");
  return res.data;
};

export const addHabit = async (habit: {
  title: string;
  category: string;
  priority: number;
  goalPerPeriod: number;
  frequency: string;
  durationDays: number;
}) => {
  const res = await api.post("/habits", habit);
  return res.data;
};

export const completeHabit = async (id: string) => {
  const res = await api.post(`/habits/${id}/complete`);
  return res.data;
};
