import api from "./client";
export const getStoreItems = async () => (await api.get("/rewards/store")).data;
export const buyReward = async (id: string) =>
  (await api.post(`/rewards/buy/${id}`)).data;
export const getOwnedRewards = async () => (await api.get("/rewards/owned")).data;
