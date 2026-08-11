import { useState } from "react";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";

function Login(){

    const[form, setForm] = useState({
            name: '',
            email:'',
            password: ''
        })
          const[show, setShow] = useState(false)
    
        function handleChange(e){
            setForm(prev =>({...prev, [e.target.name]: e.target.value}))
        }
        async function handleSubmit(e){
          e.preventDefault();
    
          try {
            const response = await fetch(`http://localhost:9000/user/add`,{
                method: 'POST',
                headers:{
                    'content-type': 'application/json'
                },
                body: JSON.stringify({form})
            });
    
            const data = await response.json();

            if(!response.ok){
            return toast.error(data.message)
        }

            toast.success(data.message)
            setForm({
            name: '',
            email:'',
            password: ''
            })
            
          } catch (error) {
             console.log(error)
          }
    
          
        }
    return(
        <div className="loginPage">
            <div className="lockHeader">
                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-key-round-icon lucide-key-round"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg>
         
          </div>
        <form onSubmit={(e) =>handleSubmit(e)}>
            <p className="heading">Login in</p>
            <div>
                <label>Name:</label>
                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-icon lucide-user-round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
                <input value={form.name}placeholder="name" name="name" onChange={(e) =>handleChange(e)} required />

                </div>
            </div>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokelinejoin="round" className="lucide lucide-lock-icon lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input placeholder="password" value={form.password} type={show ? `text` : 'password'} name="password" onChange={(e) =>handleChange(e)} required />
            {!show ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="eye" onClick={() => setShow(!show)}><path d="m15 18-.722-3.25"/><path d="M2 8a10.645 10.645 0 0 0 20 0"/><path d="m20 15-1.726-2.05"/><path d="m4 15 1.726-2.05"/><path d="m9 18 .722-3.25"/></svg>
                : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="eye" onClick={() => setShow(!show)}><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
    }</div>
            </div>
            <div>
                <a>Forget password?</a>
            </div>
            <button type="submit">login</button>

        </form>
            <p className="footer">Already have an account? <NavLink to="/sign" style={{textDecoration: "none"}}>Sign Up</NavLink></p>
        </div>
    )
}

export default Login;