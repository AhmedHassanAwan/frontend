"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Menu, X } from "lucide-react"; 
import Sidebar from '../../components/sidebar'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, } from "recharts";
import { ArrowUpCircle, ArrowDownCircle, DollarSign } from "lucide-react";
import { toast } from "react-toastify";

const BASE_URL = "http://15.206.198.248:3000";
const getToken = () => localStorage.getItem("token") || "";



const COLORS = ["#7C3AED", "#F43F5E"];

const Dashboard = () => {
  const [income, setIncome] = useState([]);
  const [expense, setExpense] = useState([]);
  const [open, setOpen] = useState(true);

const fetchIncome = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/income`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    setIncome(res.data || []);
  } catch (err) {
    console.error(err);
    toast.error("Failed to load income data");
  }
};



const fetchExpense = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/expense`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    setExpense(res.data || []);
  } catch (err) {
    console.error(err);
    toast.error("Failed to load expense data");
  }
};


  useEffect(() => {
    fetchIncome();
    fetchExpense();
  }, []);


  const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = expense.reduce((sum, e) => sum + e.amount, 0);
  const balance = totalIncome - totalExpense;

  const chartData = [
    { name: "Income", value: totalIncome },
    { name: "Expense", value: totalExpense },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 to-white">

  

         <Sidebar active="dashboard" open={open} />


    <button
  onClick={() => setOpen(!open)}
  className="md:hidden fixed top-4 left-4 bg-purple-600 text-white p-2 rounded-lg shadow-lg z-50"
>
  {open ? <X size={22} /> : <Menu size={22} />}
</button>




      <main className={`flex-1 p-6 transition-all duration-300 ${open ? "ml-64" : "ml-0"}`}>
      
        <div className="max-w-6xl mx-auto">

          <header className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-semibold text-purple-700">
              Dashboard Overview
            </h1>
          </header>


          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-gray-500 text-sm">Total Income</h4>
                <ArrowUpCircle className="text-green-500" size={20} />
              </div>
              <div className="text-2xl font-semibold text-green-600">
                ${totalIncome.toLocaleString()}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-gray-500 text-sm">Total Expense</h4>
                <ArrowDownCircle className="text-red-500" size={20} />
              </div>
              <div className="text-2xl font-semibold text-red-600">
                ${totalExpense.toLocaleString()}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-gray-500 text-sm">Balance</h4>
                <DollarSign className="text-purple-500" size={20} />
              </div>
              <div
                className={`text-2xl font-semibold ${balance >= 0 ? "text-purple-700" : "text-red-600"
                  }`}
              >
                ${balance.toLocaleString()}
              </div>
            </div>
          </div>


          <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              Income vs Expense
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              A visual breakdown of your financial summary
            </p>

            <div className="w-full h-80">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={5}
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(1)}%`
                    }
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `$${v}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;