import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, CartesianGrid, } from "recharts";
import { Plus, Download, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const API = "http://localhost:3000/expense";
const Token = () => localStorage.getItem("token") || "";

const ExpensePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [form, setForm] = useState({ category: "", amount: "", icon: "" });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("token") || "";

  useEffect(() => {
    const token = getToken();
    if (!token) navigate("/");
  }, [navigate]);

  const loadIncomes = async () => {
    try {
      const res = await axios.get("http://localhost:3000/income", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setIncomes(res.data || []);
    } catch (err) {
      console.error("Load incomes error:", err);
    }
  };
  const loadExpenses = async () => {
    try {
      const res = await axios.get(`${API}/`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setExpenses(res.data || []);
    } catch (err) {
      console.error("Load expenses error:", err);
    }
  };

  useEffect(() => {
    loadExpenses();
    loadIncomes();
  }, []);



  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const availableBalance = totalIncome - totalExpense;


  const handleAdd = async () => {
    if (!form.amount || form.amount <= 0) {
      toast.error("Amount must be greater than 0");
      setForm({ ...form, amount: "" })
      return;
    }

    if (Number(form.amount) > availableBalance) {
      toast.error("Not enough balance to add this expense!");
      return;
    }
    if (!form.category) {
      toast.error("require")
    }
    try {
      setLoading(true);
      await axios.post(
        `${API}/`,
        {
          icon: form.icon || "💸",
          amount: Number(form.amount),
          category: form.category,
          date: form.date || new Date().toISOString(),
        },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );


      toast.success("Expense added!");
      setForm({ category: "", amount: "", icon: "", data: "" });
      loadExpenses();
    } catch (err) {
      console.error("Add expense error:", err);
      toast.error(err.response?.data?.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success("Expense deleted!");
      loadExpenses();
    } catch (err) {
      console.error("Delete expense error:", err);
      toast.error("Failed to delete expense");
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(`${API}/download`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const fileUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = "expenses.xlsx";
      link.click();

      toast.success("Expenses downloaded!");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file.");
    }
  };




  const chartData = expenses.map((item) => ({
    name: new Date(item.date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    }),
    amount: item.amount,
  }));

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 to-white">

      <Sidebar open={open} onToggle={setOpen} />


      <main
        className={`flex-1 transition-all duration-300 p-6 ${open ? "ml-64" : "ml-0"
          }`}
      >
        <header className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-purple-700 mt-4">
            Expense Overview
          </h2>
        </header>

        <section className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-medium">Expense Summary</h3>
              <p className="text-sm text-gray-500">
                Track your spending trends over time.
              </p>
            </div>
            <button
              className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
              onClick={() => document.getElementById("addModal").showModal()}
              disabled={totalIncome <= 0}
            >
              <Plus size={16} /> Add Expense
            </button>
            {totalIncome <= 0 && (
              <p className="text-sm text-red-500 mt-2">
                ⚠️ Please add income before adding expenses.
              </p>
            )}


          </div>

          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPurple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" />
                <Tooltip
                  formatter={(value) => [`$${value}`, "Amount"]}
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    border: "1px solid #ddd",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#7c3aed"
                  strokeWidth={2.5}
                  fill="url(#colorPurple)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>


        <section className="bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium">All Expenses</h4>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 border px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <Download size={16} /> Download
            </button>
          </div>

          {expenses.length === 0 ? (
            <div className="text-gray-500 py-6 text-center">No expenses yet</div>
          ) : (
            <div className="flex flex-col gap-3">
              {expenses.map((exp) => (
                <div
                  key={exp._id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                      {exp.icon || "💸"}
                    </div>
                    <div>
                      <div className="font-medium">{exp.category}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(exp.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-red-500 font-medium">
                      ${exp.amount}
                    </div>
                    <button
                      onClick={() => handleDelete(exp._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>


        <dialog id="addModal" className="modal">
          <div className="modal-box bg-white p-6 rounded-2xl shadow">
            {availableBalance <= 0 && (
              <p className="text-sm text-red-500 mt-2">
                ⚠️ You have no remaining balance. Please add more income.
              </p>
            )}

            <h3 className="text-lg font-medium mb-4">Add New Expense</h3>
            <div className="flex flex-wrap gap-4">
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="border rounded-lg px-3 py-2 flex-1"
                placeholder="Category (Food, Travel...)"
              />
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="border rounded-lg px-3 py-2 w-32"
                placeholder="Amount"
              />
              <input
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="border rounded-lg px-3 py-2 w-24"
                placeholder="💸"
              />
            </div>

            <div className="w-full md:w-1/4">
              <label className="text-sm text-gray-600">Date</label>
              <input
                type="date"
                value={form.date || new Date().toISOString().split("T")[0]}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={handleAdd}
                disabled={loading}
                className="bg-purple-600 text-white px-5 py-2 rounded-lg"
              >
                {loading ? "Adding..." : "Add"}
              </button>
              <form method="dialog">
                <button className="border px-5 py-2 rounded-lg">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      </main>
    </div>
  );
};

export default ExpensePage;