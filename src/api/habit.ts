import api from "./client";

// 🔹 Alışkanlıkları getir
export const getHabits = async () => {
  const res = await api.get("/habits");
  return res.data;
};

// 🔹 Yeni alışkanlık ekle
export const addHabit = async (habit: {
  title: string;
  category: string;
  priority: number;
  goalPerPeriod: number;
  frequency: string;
  durationDays?: number; // opsiyonel
  reminderTime?: string | null; // 🔔 HH:mm formatında eklendi
}) => {
  const res = await api.post("/habits", habit);
  return res.data;
};

// 🔹 Alışkanlığı tamamla
export const completeHabit = async (id: string) => {
  const res = await api.post(`/habits/${id}/complete`);
  return res.data;
};
