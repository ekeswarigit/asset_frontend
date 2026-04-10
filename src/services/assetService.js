const BASE_URL = "http://localhost:8080/api/assets";

// GET all assets
export const getAssets = async () => {
  const res = await fetch(BASE_URL);
  return res.json();
};

// POST (add asset)
export const addAsset = async (data) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

// PUT (update asset)
export const updateAsset = async (id, data) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

// DELETE asset
export const deleteAsset = async (id) => {
  await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
};