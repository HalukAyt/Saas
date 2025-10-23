import api from "./client";
export const getFeed = async () => (await api.get("/achievements/feed")).data;
export const createAchievement = async (data: any) =>
  (await api.post("/achievements", data, {
    headers: { "Content-Type": "multipart/form-data" },
  })).data;