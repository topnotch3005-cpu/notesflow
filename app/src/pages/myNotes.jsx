import { useEffect } from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { editNoteIdContext, tokenContent, isloggedContext } from "../App";
import EditNotes from "../components/editNotes";
import { useContext } from "react";
import toast from "react-hot-toast";

function Notes(){

    const[notesList, setNotesList] = useState([])
    const[filteredList, setFilteredList] = useState([])
    const[warning, setWarning] = useState(false)
    const[deleteId, setDeleteId] = useState(null)
    const[menuOption, setMenuOption] = useState('All')

    const[archivedList, setArchivedList] = useState([])
    const[trashedList, setTrashedList] = useState([])

     const{editNoteId, setEditNoteId} = useContext(editNoteIdContext);
     const{token, setToken} = useContext(tokenContent)
     const{islogged, setIslogged} = useContext(isloggedContext)


    async function handleSubmit(){

      try {
        const response = await fetch(`http://localhost:9000/note/get`,{
            method: 'POST',
            headers:{
                'authorization': `Bearer ${token}`,
                'content-type': 'application/json'
            },
            credentials: 'include'
        });

        const data = await response.json();
        if(response.status === 401){
           refreshPage()
        }
        else if(!response.ok){
              console.log(data.message)
        }else{
        setFilteredList(data)
        setNotesList(data)
        
        }
        
      } catch (error) {
         console.log(error)
      }
    }
    async function deleteNote(id){

      try {
        const response = await fetch(`http://localhost:9000/note/delete/${id}`,{
            method: 'DELETE',
            headers:{
            'authorization': `Bearer ${token}`,
            }
        });

        const data = await response.json();

        setNotesList(data)

        setWarning(!warning)
        
      } catch (error) {
         console.log(error)
      }
    }

    async function refreshPage(){
        const res = await fetch(`http://localhost:9000/note/refresh`,{
            method: 'POST',
            credentials: 'include'
           })
           const refreshing = await res.json()
           if(!res.ok){
            window.location.href = "/sign"
           }
           else{
            setToken(refreshing.accessToken)
            setIslogged(true)
           }
    }
function updatestatus(e, id){

        const actionBtn = e.target.innerText;
  let field;

  if (actionBtn === "Pinned") {
    field = "isPinned";
  } else if (actionBtn === "Archived"){
    field = "isArchived";
  }else if (actionBtn === "unArchived"){
    field = "isArchived";
  }else {
    field = "isTrashed";
  }

  // find the current note to know its current value before flipping
  const note = notesList.find(element => element._id === id);
  const newValue = !note[field];

    setFilteredList(prev => prev.map(element =>
    element._id === id ? { ...element, [field]: newValue } : element
  ));

  setNotesList(prev => prev.map(element =>
    element._id === id ? { ...element, [field]: newValue } : element
  ));

  
  update({ [field]: newValue }, id);
}
    

async function update(status, id) {
  try {
    const response = await fetch(`http://localhost:9000/note/updateStatus/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(status),
    });

    const data = await response.json();
    
    setNotesList(data);
  } catch (err) {
    console.error(err);
  }
}

    useEffect(() =>{
      if(menuOption === 'All'){
         setFilteredList(notesList.filter(element => !element.isArchived && !element.isTrashed)
        )
      }
      else if(menuOption === "Pinned"){
        setFilteredList(notesList.filter(element => element.isPinned))
      }
       else if(menuOption === "Archived"){
        setFilteredList(notesList.filter(element => element.isArchived))
      }
       else if(menuOption === "Trashed"){
        setFilteredList(notesList.filter(element => element.isTrashed))
      }

        
    
    }, [notesList])

    function filter(option){

      if(option === "All"){
      setFilteredList(notesList.filter(element => !element.isArchived && !element.isTrashed)); 
      setMenuOption("All")
      }
      
      else if(option === "Pinned"){
      setFilteredList(notesList.filter(element => element.isPinned)); 
      setMenuOption("Pinned")
      }

      
      else if(option === "Archived"){
      setFilteredList(notesList.filter(element => element.isArchived)); 
      setMenuOption("Archived")
      }

      
      else if(option === "Trashed"){
      setFilteredList(notesList.filter(element => element.isTrashed)); 
      setMenuOption("Trashed")
      }


    }
   


    useEffect(() =>{
     handleSubmit()
    }, [])
     useEffect(() =>{
     handleSubmit()
    }, [token])

    return(
        <div className="note">
        <div className="heading">
         <p>My Notes <span style={{fontSize: "1.5rem"}}>({menuOption})</span></p>
         <div>
         <NavLink to="./note"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy-plus-icon lucide-copy-plus"><line x1="15" x2="15" y1="12" y2="18"/><line x1="12" x2="18" y1="15" y2="15"/><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg></NavLink>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menuBtn"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
         <div className="menu" >
              <div onClick={() => filter('All')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallet-cards-icon lucide-wallet-cards"><path d="M3 11h3.75a2 2 0 0 1 1.6.8l.45.6a4 4 0 0 0 6.4 0l.45-.6a2 2 0 0 1 1.6-.8H21"/><path d="M3 7h18"/><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                <a>all</a>
            </div>
            <div onClick={() => filter('Pinned')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pin-icon lucide-pin"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>
                <a>Pinned</a>
            </div>
            <div onClick={() => filter('Archived')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder-bookmark-icon lucide-folder-bookmark"><path d="M12 6v8l3-3 3 3V6"/><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z"/></svg>
               <a>Archived</a>
            </div>
            <div onClick={() => filter('Trashed')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                <a>Trashed</a>
            </div>
         </div>
         </div>
         </div>
         <div className="notesContainer">
          {menuOption === "All" &&
        (filteredList.length !== 0 ? filteredList.map(element =>(
            <div className="notesElement" style={{backgroundColor: element.color || 'yellow'}} key={element._id}>
                <div>
                    <p>{element.title}</p>
                   
                    <div>
                        {element.isPinned ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pin-icon lucide-pin"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg> : <></>}
                        <NavLink to="/edit"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pen-icon lucide-pen" onClick={() => setEditNoteId(element._id)}><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /></svg></NavLink>
                        {!element.isTrashed ?  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2-icon lucide-trash-2" onClick={(e) => updatestatus(e, element._id)}><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg> :
                        <div><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2-icon lucide-trash-2" onClick={() => setWarning(!warning)}><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-ccw-icon lucide-rotate-ccw" onClick={(e) => updatestatus(e, element._id)}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                       
                        </div>}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="hiddenMenu" ><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                          <div className="hiddenOption">
                            <a onClick={(e) => updatestatus(e, element._id)}>Pinned</a>
                            <a onClick={(e) => updatestatus(e, element._id)}>Archived</a>
                        </div>
                         
                    </div>
                </div> 
                 <div className="tagDisplay">
                    {element.tags.map((tag,index) =>(
                        <a key={index}>{tag}</a>
                    ))}
                    </div>
                <div className="content" style={{background: element.color || 'yellow'}}>
                     <a>{element.content}</a>
                    </div>
           
            <a>last update: {new  Date(element.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            })}</a>
        
        </div>
    )) : <div className="nonote"><p>No Notes yet</p>
        <NavLink to="/note"><button>Add note</button></NavLink> </div>)}
        {menuOption === "Pinned" &&  (filteredList.length !== 0 ? filteredList.map(element =>(
            <div className="notesElement" style={{backgroundColor: element.color || 'yellow'}} key={element._id}>
                <div>
                    <p>{element.title}</p>
                   
                    <div>
                        {element.isPinned ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pin-icon lucide-pin"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg> : <></>}
                        <NavLink to="/edit"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pen-icon lucide-pen" onClick={() => setEditNoteId(element._id)}><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /></svg></NavLink>
                        {!element.isTrashed ?  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2-icon lucide-trash-2" onClick={(e) => updatestatus(e, element._id)}><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg> :
                        <div><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2-icon lucide-trash-2" onClick={() => setWarning(!warning)}><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-ccw-icon lucide-rotate-ccw" onClick={(e) => updatestatus(e, element._id)}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                       
                        </div>}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="hiddenMenu" ><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                          <div className="hiddenOption">
                            <a onClick={(e) => updatestatus(e, element._id)}>Pinned</a>
                            <a onClick={(e) => updatestatus(e, element._id)}>Archived</a>
                        </div>
                         
                    </div>
                </div> 
                 <div className="tagDisplay">
                    {element.tags.map((tag,index) =>(
                        <a key={index}>{tag}</a>
                    ))}
                    </div>
                <div className="content" style={{background: element.color || 'yellow'}}>
                     <a>{element.content}</a>
                    </div>
           
            <a>last update: {new  Date(element.createdAt).toLocaleDateString()}</a>
         {warning ?<div className="warning">
            <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-triangle-alert-icon lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg></div>
                            <p>Delete this note?</p>
                            <span>This action cannot be undone. Note will be permanently removed from your workspace</span>
                            <a onClick={() => deleteNote(element._id)} style={{color: "white", backgroundColor: "red"}}>Delete</a>
                            <a onClick={() => setWarning(false)}>Canel</a>
                            </div>: <></>}
        </div>
    )) : <div className="nonote"><p>No Notes is Pinned</p></div> )}  
          {menuOption === "Archived" &&  (filteredList.length !== 0 ? filteredList.map(element =>(
            <div className="notesElement" style={{backgroundColor: element.color || 'yellow'}} key={element._id}>
                <div>
                    <p>{element.title}</p>
                   
                    <div>
                        {element.isPinned ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pin-icon lucide-pin"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg> : <></>}
                        <NavLink to="/edit"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pen-icon lucide-pen" onClick={() => setEditNoteId(element._id)}><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /></svg></NavLink>
                        {!element.isTrashed ?  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2-icon lucide-trash-2" onClick={(e) => updatestatus(e, element._id)}><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg> :
                        <div><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2-icon lucide-trash-2" onClick={() => setWarning(!warning)}><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-ccw-icon lucide-rotate-ccw" onClick={(e) => updatestatus(e, element._id)}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                       
                        </div>}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="hiddenMenu" ><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                          <div className="hiddenOption">
                            <a onClick={(e) => updatestatus(e, element._id)}>Pinned</a>
                            <a onClick={(e) => updatestatus(e, element._id)}>unArchived</a>
                        </div>
                         
                    </div>
                </div> 
                 <div className="tagDisplay">
                    {element.tags.map((tag,index) =>(
                        <a key={index}>{tag}</a>
                    ))}
                    </div>
                <div className="content" style={{background: element.color || 'yellow'}}>
                     <a>{element.content}</a>
                    </div>
           
            <a>last update: {new  Date(element.createdAt).toLocaleDateString()}</a>
         {warning ?<div className="warning">
            <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-triangle-alert-icon lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg></div>
                            <p>Delete this note?</p>
                            <span>This action cannot be undone. Note will be permanently removed from your workspace</span>
                            <a onClick={() => deleteNote(element._id)} style={{color: "white", backgroundColor: "red"}}>Delete</a>
                            <a onClick={() => setWarning(false)}>Canel</a>
                            </div>: <></>}
        </div>
    )) : <div className="nonote"><p>No Notes in Archieved</p>
         </div>)}
        {menuOption === "Trashed" &&  (filteredList.length !== 0 ? filteredList.map(element =>(
            <div className="notesElement" style={{backgroundColor: element.color || 'yellow'}} key={element._id}>
                <div>
                    <p>{element.title}</p>
                   
                    <div>
                        {element.isPinned ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pin-icon lucide-pin"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg> : <></>}
                        <NavLink to="/edit"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pen-icon lucide-pen" onClick={() => setEditNoteId(element._id)}><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /></svg></NavLink>
                        {!element.isTrashed ?  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2-icon lucide-trash-2" onClick={(e) => updatestatus(e, element._id)}><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg> :
                        <div><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2-icon lucide-trash-2" onClick={() => {setDeleteId(element._id); setWarning(true)}}><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-ccw-icon lucide-rotate-ccw" onClick={(e) => updatestatus(e, element._id)}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                       
                        </div>}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="hiddenMenu" ><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                          <div className="hiddenOption">
                            <a onClick={(e) => updatestatus(e, element._id)}>Pinned</a>
                            <a onClick={(e) => updatestatus(e, element._id)}>Archived</a>
                        </div>
                         
                    </div>
                </div> 
                 <div className="tagDisplay">
                    {element.tags.map((tag,index) =>(
                        <a key={index}>{tag}</a>
                    ))}
                    </div>
                <div className="content" style={{background: element.color || 'yellow'}}>
                     <a>{element.content}</a>
                    </div>
           
            <a>last update: {new  Date(element.createdAt).toLocaleDateString()}</a>
       
        </div>
    )) : <div className="nonote"><p>No Notes in Trashed</p>
        </div>)}


 {warning ?<div className="warning">
            <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-triangle-alert-icon lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg></div>
                            <p>Delete this note?</p>
                            <span>This action cannot be undone. Note will be permanently removed from your workspace</span>
                            <a onClick={() => deleteNote(deleteId)} style={{color: "white", backgroundColor: "red"}}>Delete</a>
                            <a onClick={() => setWarning(false)}>Canel</a>
                            </div>: <></>}
         </div>
        </div>
    )
}

export default Notes;