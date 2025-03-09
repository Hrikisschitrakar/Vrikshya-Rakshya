import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://127.0.0.1:8000";  // Replace with actual FastAPI server IP


export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
        return response.data;  // Should return { token: "your_jwt_token" }
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};


export const getProfile = async () => {
  const token = await AsyncStorage.getItem("token");
  try {
    const response = await axios.get(`${API_BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Profile fetch error:", error.response?.data || error);
    throw error;
  }
};
