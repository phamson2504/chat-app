import React, { useState, useEffect } from 'react'
import './Login.css'
import { CiUser } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { loginRoute } from '../../Untils/APIRoutes';

function Login() {
    const navigate = useNavigate();

    const [values, setValues] = useState({ username: "", password: "" });

    const toastOptions = {
        position: "bottom-right",
        autoClose: 1000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const validate = () => {
        const { username, password } = values;
        if (username === "") {
            toast.error("Username and Password is required.", toastOptions);
            return false;
        } else if (password === "") {
            toast.error("Username and Password is required.", toastOptions);
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validate()) {
            const { username, password } = values;
            const { data } = await axios.post(loginRoute, {
                username, password,
            });
            if (data.status === false) {
                toast.error(data.msg, toastOptions)
            }
            else {
                localStorage.setItem(
                    process.env.REACT_APP_LOCALHOST_KEY,
                    data.accessToken
                  );
                navigate("/")
            }
        }
        ;
    }

    return (
        <>
            <div className='body'>
                <div className='container'>
                    <form action="" onSubmit={(event) => handleSubmit(event)}>
                        <div className='header'>
                            <h1>Login</h1>
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
                        {/* <div className='remember-forgot'>
                            <label><input type='checkbox' />Remember me</label>
                            <a href='#'>Forgot password</a>
                        </div> */}
                        <button type='submit'>Login</button>
                        <div className='register-link'>
                            <p>Don't have an account? <Link to="/register">Register</Link></p>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default Login