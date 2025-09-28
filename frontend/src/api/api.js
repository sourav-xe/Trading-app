import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // backend URL
});

API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem("userInfo"); // ✅ must match
  if (userInfo) {
    req.headers.Authorization = `Bearer ${JSON.parse(userInfo).token}`;
  }
  return req;
});

// Auth
export const login = (formData) => API.post("/auth/login", formData);
export const signup = (formData) =>
  API.post("/auth/signup", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Products
export const getProducts = () => API.get("/products");
export const getProductById = (id) => API.get(`/products/${id}`);

// Portfolio
export const getPortfolio = () => API.get("/portfolio");

// Transactions
export const buyProduct = (data) => API.post("/transactions/buy", data);
export const sellProduct = (data) => API.post("/transactions/sell", data);

// Watchlist
export const addToWatchlist = (productId) =>
  API.post("/portfolio/watchlist/add", { productId });
export const removeFromWatchlist = (productId) =>
  API.post("/portfolio/watchlist/remove", { productId });

export default API;
