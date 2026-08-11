import { NavLink } from "react-router-dom";
import { isloggedContext } from "../App";
import { useContext } from "react";

function Header(){

    const{islogged, setIslogged} = useContext(isloggedContext)

    async function Logout(){
        try{
            const response = await fetch(`http://localhost:9000/user/logout`,{
            method: 'POST',
            headers:{
                'content-type': 'application/json'
            },
            credentials: 'include',
        });
        if(!response.ok){
            console.log(`try again`)
        }
        else{
            window.location.reload()
        }
        }
        catch(err){
            console.log(err)
        }
    }

    return(
        <div className="header">
            <NavLink to="/"><p>Notes<span style={{color: "purple"}}>Flow</span></p></NavLink>
            <div>
                {!islogged ?
                <>
                <NavLink to="/sign">Sign</NavLink>
                <NavLink to="/login">login</NavLink>
                </>
                : <a onClick={Logout}>Logout</a>}
            </div>
        </div>
    )
}

export default Header;