import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { tokenContent } from "../App";
import toast from "react-hot-toast";
import { isloggedContext } from "../App";

function Sign(){

    const[form, setForm] = useState({
        email:'',
        password: ''
    })
    const[show, setShow] = useState(false)

    const{token, setToken} = useContext(tokenContent)
    const{islogged, setIslogged} = useContext(isloggedContext)

    function handleChange(e){
        setForm(prev =>({...prev, [e.target.name]: e.target.value}))
    }
    async function handleSubmit(e){
      e.preventDefault();

      try {
        const response = await fetch(`${import.meta.env.VITE_API__URL}/user/find`,{
            method: 'POST',
            headers:{
                'content-type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({form})
        });

        const data = await response.json();
        if(!response.ok){
           return  toast.error(data.message)
        }
      setToken(data.accessToken)
      toast.success(data.message)
      setIslogged(true)
        setForm({
        email:'',
        password: ''
        })
         setClicked(true)
            setTimeout(() => window.location.href = "/"
                , 500)
        
      } catch (error) {
         console.log(error)
      }

      
    }

    return(
        <div className="signPage">
            <div className="lockHeader">
             <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock-keyhole-icon lucide-lock-keyhole"><circle cx="12" cy="16" r="1"/><rect x="3" y="10" width="18" height="12" rx="2"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/></svg>
            </div>
        <form onSubmit={(e) =>handleSubmit(e)}>
            <p className="heading">Sign in</p>
            <div>
                <label>Email:</label>
                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail-icon lucide-mail"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>
                <input placeholder="email" value={form.email} name="email" onChange={(e) =>handleChange(e)} required />

                </div>
            </div>
             <div>
                <label>Password:</label>
         <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock-icon lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input placeholder="password" value={form.password} type={show ? `text` : 'password'} name="password" onChange={(e) =>handleChange(e)} required />
            {!show ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="eye" onClick={() => setShow(!show)}><path d="m15 18-.722-3.25"/><path d="M2 8a10.645 10.645 0 0 0 20 0"/><path d="m20 15-1.726-2.05"/><path d="m4 15 1.726-2.05"/><path d="m9 18 .722-3.25"/></svg>
                : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="eye" onClick={() => setShow(!show)}><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
    }</div> </div>
            <div>
                <a>Forget password?</a>
            </div>
            <button type="submit">login</button>

            <p className="footer">Don't have an account? <NavLink to="/login" style={{textDecoration: "none"}}>Login</NavLink></p>
        </form>
        </div>
    )
}

export default Sign;