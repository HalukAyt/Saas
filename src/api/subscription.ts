import api from "./client";
export const getSubscriptionStatus = async () => (await api.get("/subscription/status")).data;
export const verifySubscription = async (data: any) => (await api.post("/subscription/verify", data)).data;
export const cancelSubscription = async () => (await api.post("/subscription/cancel")).data;
