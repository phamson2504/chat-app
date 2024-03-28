import React, { useState, useEffect } from 'react'
import './Register.css'
import { CiUser } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { MdOutlineEmail } from "react-icons/md";
import axios from 'axios';
import { registerRoute } from '../../Untils/APIRoutes';

function Register() {
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 4) {
      toast.error(
        "Username must be equal to or greater than 4 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 4) {
      toast.error(
        "Password must be equal to or greater than 4 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validation()) {
      const { password, username, email } = values;
      const { data } = await axios.post(registerRoute, {
        username, email, password,
      })
      if (data.status === false) {
        toast.error(data.msg, toastOptions)
      } else {
        navigate("/login");
      }
    }
  };

  return (
    <>
      <div className='body'>
        <div className='container'>
          <form action="" onSubmit={(event) => handleSubmit(event)}>
            <div className='header'>
              <h1>Registration</h1>
            </div>
            <div className='input-box'>
              <input type='email'
                placeholder='Email'
                name="email"
                onChange={(e) => handleChange(e)}
              />
              <MdOutlineEmail className='icon' />
            </div>
            <div className='input-box'>
              <input type='text'
                placeholder='username'
                name="username"
                onChange={(e) => handleChange(e)}
              />
              <CiUser className='icon' />
            </div>
            <div className='input-box'>
              <input type='password'
                placeholder='password'
                name="password"
                onChange={(e) => handleChange(e)}
              />
              <RiLockPasswordLine className='icon' />
            </div>
            <div className='input-box'>
              <input type='password'
                placeholder='Confirm Password'
                name="confirmPassword"
                onChange={(e) => handleChange(e)}
              />
              <RiLockPasswordLine className='icon' />
            </div>
            <button type='submit'>Create</button>
            <div className='register-link'>
              <p>Already have an account ? <Link to="/login">Login</Link></p>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>

  )
}

export default Register