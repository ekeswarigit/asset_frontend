import api from "./api";

// GET
export const getAssets = async () => {
  const res = await api.get("/assets");
  return res.data;
};

// POST
export const addAsset = async (data) => {
  const res = await api.post("/assets", data);
  return res.data;
};

// PUT
export const updateAsset = async (id, data) => {
  const res = await api.put(`/assets/${id}`, data);
  return res.data;
};

// DELETE
export const deleteAsset = async (id) => {
  await api.delete(`/assets/${id}`);
};