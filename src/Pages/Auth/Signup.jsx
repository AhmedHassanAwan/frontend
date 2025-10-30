import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Inputs from '../../components/Inputs/Inputs';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import { validateEmail } from '../../utils/helper';
import axios from 'axios';

function Signup() {
  const [fullname, setfullname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState("");
  const [profilePic, setprofilePic] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    let profilePicUrl = "";

    
    if (!fullname) return seterror("Please enter your full name");
    if (!validateEmail(email)) return seterror("Please enter a valid email address");
    if (!password) return seterror("Please enter your password");

    seterror("");

    try {
   
      const res = await axios.post("http://localhost:3000register", {
        fullName:fullname,
        email,
        password,
        profilePic: profilePicUrl
      });

      console.log(" Signup Successful:", res.data.token);
      console.log(" Signup Successful:", res.data);

      alert("User Registered Successfully!");

     
      navigate("/login");
    } catch (err) {
      console.error(" Signup Error:", err.response?.data || err.message);
      seterror(err.response?.data?.message || "Something went wrong. Try again!");
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[full] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold">Create an account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setimage={setprofilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Inputs
              type="text"
              placeholder="Enter your full name"
              lable="Full Name"
              value={fullname}
              onChange={(e) => setfullname(e.target.value)}
            />
            <Inputs
              type="text"
              placeholder="Enter your email"
              lable="Email Address"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
            <div className="col-span-2">
              <Inputs
                type="password"
                placeholder="Min. 8 characters"
                lable="Password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button type="submit" className="w-full btn-primary mt-4">
            SIGN UP
          </button>

          <p className="text-sm text-center mt-3 text-slate-600">
            Already have an account?{" "}
            <Link className="font-medium text-primary underline" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Signup;
