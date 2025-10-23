import api from "./client";
export const getXPLogs = async () => (await api.get("/xplogs")).data;
