import api from "./api";

export const getLocations = () => api.get("/locations");