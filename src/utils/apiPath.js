import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/v1", 
});
const token = localStorage.getItem("token");




export const getIncome = async () => {
  const res = await API.get("/income", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.incomes;
}

export const getMonthlyIncome = async () => {
  const res = await API.get("/income/monthly");
  return res.data.monthlyIncome;
};

export const addIncome = async (data) => {
  const res = await API.post("/income", data);
  return res.data;
};
