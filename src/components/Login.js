import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = (props) => {


    let navigate=useNavigate();

    const [credentials,setCredentials]=useState({email:"",password:""});

    const host = "http://localhost:5000";
    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = `${host}/api/auth/login`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email: credentials.email  ,  password: credentials.password}),
        })
        const json =await response.json();
        console.log(json);
        if(json.success)
        {
            //save the token and redirect to the home page
            localStorage.setItem('token',json.authToken);
            props.showAlert("Succesfully Logined","success");
            navigate("/");
        }        
        else
        {
            props.showAlert("Invalid Details","danger");
        }
    }
    const onChange=(e)=>{
        setCredentials({...credentials,[e.target.name] : e.target.value})
    }
    return (
        <div>
            <h2>Warm Welcome...Login to enjoy the ride.....!</h2>
            <form className="row g-3 my-3" onSubmit={handleSubmit}>
                <div className="col-auto">
                    <label htmlFor="email" className="visually-hidden">Email</label>
                    <input type="email" className="form-control-plaintext" id="email" name='email' onChange={onChange} placeholder="email@example.com" />
                </div>
                <div className="col-auto">
                    <label htmlFor="password" className="visually-hidden">Password</label>
                    <input type="password" className="form-control" id="password" name='password' onChange={onChange} placeholder="Password" />
                </div>
                <div className="col-auto">
                    <button type="submit" className="btn btn-primary mb-3">Confirm identity</button>
                </div>
            </form>
        </div>
    )
}

export default Login
