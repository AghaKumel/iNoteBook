import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'


const Signup = (props) => {

    const host = "http://localhost:5000";
    const [credentials,setCredentials]=useState({name:"",email:"",password:"",cpassword:""});
    const navigate=useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (credentials.password !== credentials.cpassword) {
            alert("Passwords do not match!");
            return;
        }

        const url = `${host}/api/auth/createuser`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name: credentials.name, email: credentials.email  ,  password: credentials.password}),
        })
        const json =await response.json();
        console.log(json);
        if(json.success)
        {
            //save the token and redirect to the home page
            localStorage.setItem('token',json.authToken);
            props.showAlert("Account created Succesfully","success");
            navigate("/");
        }        
        else
        {
            props.showAlert("Invalid Credentials","danger");
        }   
    }

    const onChange=(e)=>{
        setCredentials({...credentials,[e.target.name] : e.target.value})
    }

    return (
        <div className='container'>
            <h2>Welcome..ThankYou for choosing us...!</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3 my-2">
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" className="form-control" id="name" name='name' placeholder='Enter your name' onChange={onChange} />
                    </div>
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name='email' placeholder='Enter your email' onChange={onChange} aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name='password' placeholder='Enter your Password' onChange={onChange} minLength={5} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" name='cpassword' placeholder='Eonfirm your password' onChange={onChange} minLength={5} required />
                </div>
                <div id="emailHelp" className="form-text my-2">We'll never share your data with anyone else.</div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Signup
