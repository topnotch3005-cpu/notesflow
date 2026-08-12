import { useContext, useEffect } from "react";
import { useState, useRef } from "react";
import { tokenContent } from "../App";
import toast from "react-hot-toast";



function AddNotes(){
    const[notesForm, setNotesForm] = useState({
        title: '',
        content: '',
        category: '',
        tags: [],
        color: '',
        isPinned: false,
        isArchived: false,
        isTrashed: false,
    })
    const[selectedColor, setSelectedColor] = useState("")

    const{token, setToken} = useContext(tokenContent)

    const tagRef = useRef()

    function handleChange(e){
        setNotesForm(prev =>({
            ...prev, [e.target.name]: e.target.value
        }))
    }

    function addTag(){
        
        const newTagValue = tagRef.current.value;
        tagRef.current.value = ''
        
        if(!newTagValue){ 
         tagRef.current.focus()
        return } 
        setNotesForm(prev => ({...prev, tags: [...prev.tags, newTagValue]}))
    }
    function removeTag(index){
        setNotesForm(prev => ({...prev, tags: prev.tags.filter((_,i) => i !== index)}))
    }

    function addColor(color){
      setSelectedColor(color)

       setNotesForm(prev =>({
            ...prev, color: color
        }))
    }




    const colorOption = ['hsl(45, 90%, 78%)', 'hsl(25, 90%, 78%)', 'hsl(340, 75%, 80%)', 'hsl(270, 65%, 80%)','hsl(205, 80%, 78%)', 'hsl(145, 55%, 76%)']


    async function handleSubmit(e){
          e.preventDefault();
    
          try {
            const response = await fetch(`${import.meta.env.VITE_API__URL}/note/add`,{
                method: 'POST',
                headers:{
                    'authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                body: JSON.stringify(notesForm)
            });
    
            const data = await response.json();

            toast.success(data.message)
            setNotesForm({
            title: '',
            content: '',
            category: '',
            tags: [],
            color: '',
            isPinned: false,
            isArchived: false,
            isTrashed: false,
            })
             setClicked(true)
            setTimeout(() => window.location.href = "/"
                , 500)
            
          } catch (error) {
             console.log(error)
          }
    
          
        }

    return(
        <div className="addNotesPage">
        <div className="notesHeading">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen-icon lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
            <div>
                <p>Add New Note</p>
                <a>Capture your thoughts and ideas</a>
            </div>
            </div>
            <form onSubmit={(e) =>handleSubmit(e)}>
                <div className="notesEditor">
                    <div>
                        <a>Title</a>
                        <input placeholder="enter notes title..." name="title" value={notesForm.title} onChange={(e) => handleChange(e)} required />
                    </div>
                    <div>
                        <a>Tags</a>
                        <div className="tagBtn">
                        {notesForm.tags.length !== 0  ? notesForm.tags.map((element,index) =>( <div><a>{element}</a> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x" onClick={() => removeTag(index)}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </div>)): <></>}
                        {notesForm.tags.length < 3 ? <input placeholder="add tags... (max 3 tags)" ref={tagRef} name="tags" /> : <></>}
                        {notesForm.tags.length < 3 ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus" onClick={addTag}><path d="M5 12h14"/><path d="M12 5v14"/></svg>: <></>}
                        </div>
                    </div>
                    <div>
                        <a>Category</a>
                        <input placeholder="Select category" name="category" value={notesForm.category} onChange={(e) => handleChange(e)} />
                    </div>
                    <div>
                        <a>Colour</a>
                        <div className="colorPick">
                            {colorOption.map(color =>(
                                <div style={{backgroundColor: `${color}`}} className={selectedColor === color ? `colorOption colorSelected` : `colorOption`} onClick={() => addColor(color)}></div>
                            ))
                            }
                        </div>
                    </div>
                </div>
                <div>
                    <textarea placeholder="text here..." name="content" value={notesForm.content} onChange={(e) => handleChange(e)} required />
                </div>
                <button type="submit">Add</button>
            </form>

        </div>
    )
}

export default AddNotes;