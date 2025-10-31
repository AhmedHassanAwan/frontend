import React, { useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import Inputs from '../../components/Inputs/Inputs';
import { validateEmail } from '../../utils/helper';
import { validatePassword } from '../../utils/helper';
import axios from 'axios';
import { toast } from "react-toastify";

function Login() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState("");
  const navigate = useNavigate();


  const handlelogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      seterror("Please enter a valid email address");
      return;
    }
    if (!validatePassword(password)) {
      seterror("Please enter your password");
      return;
    }

    seterror("");

    try {
      const res = await axios.post("http://localhost:3000/login", {
        email,
        password
      });

      // console.log("Login Response:", res.data);

      localStorage.setItem("token", res.data.token);
      toast.success("Login successful!");

      navigate("/dashboard");

    } catch (err) {
      toast.error("Invalid credentials!");
      console.error(" Login Error:", err.response?.data || err.message);
      seterror(err.response?.data?.message || "Something went wrong. Try again!");
    }
  };

  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Welcome Back</h3>
        <p className='text-xs text-slate-700 mt-[-5px] mb-6'>
          Please enter your details to log in.
        </p>

        <form onSubmit={handlelogin}>
          <Inputs
            type="text"
            placeholder="Enter your email"
            lable="Email Address"
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />

          <Inputs
            type="password"
            placeholder="At least 9 chars,  uppercase,  lowercase,  number & symbol"
            lable="Password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />

          {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}

          <button type="submit" className="w-full btn-primary">
            LOGIN
          </button>

          <p className='text-sm text-center mt-3 text-slate-600'>
            Don't have an account?{" "}
            <Link className='font-medium text-primary underline' to="/signup">
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Login;
