
import API from "../api/api";

export const getIncome = async () => {
  const res = await API.get("/income");
  return res.data.incomes;
};

export const getMonthlyIncome = async () => {
  const res = await API.get("/income/monthly");
  return res.data.monthlyIncome;
};

export const addIncome = async (data) => {
  const res = await API.post("/income", data);
  return res.data;
};
