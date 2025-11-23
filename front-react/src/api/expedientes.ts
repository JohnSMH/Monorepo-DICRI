import api from "./api";

export const getExpedientes = async () => {
  const res = await api.get("/expedientes");
  return res.data;
};
