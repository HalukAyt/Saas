import api from "./client";
export const getFriends = async () => (await api.get("/friends")).data;
export const sendFriendRequest = async (receiverId: any) =>
  (await api.post(`/friends/request?receiverId=${receiverId}`)).data;
export const acceptRequest = async (requesterId: any) =>
  (await api.post(`/friends/accept?requesterId=${requesterId}`)).data;