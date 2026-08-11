import { useState, useRef } from "react";
import { editNoteIdContext } from "../App";
import { useContext } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";


function EditNotes(){
       
        const{editNoteId, setEditNoteId} = useContext(editNoteIdContext)

        const[editnotesForm, setEditNotesForm] = useState({
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
        const[clicked, setClicked] = useState(false)
    
        const tagRef = useRef()
    
        function handleChange(e){
            setEditNotesForm(prev =>({
                ...prev, [e.target.name]: e.target.value
            }))
        }
    
         function addTag(){
        const newTagValue = tagRef.current.value;
        tagRef.current.value = ''
        
        if(!newTagValue){ 
         tagRef.current.focus()
        return } 
        setEditNotesForm(prev => ({...prev, tags: [...prev.tags, newTagValue]}))
    }
    function addColor(color){
      setSelectedColor(color)

       setEditNotesForm(prev =>({
            ...prev, color: color
        }))
    }
     function removeTag(index){
        setEditNotesForm(prev => ({...prev, tags: prev.tags.filter((_,i) => i !== index)}))
    }

    async function handleSubmit(e){
          e.preventDefault();
    
          try {
            const response = await fetch(`http://localhost:9000/note/update`,{
                method: 'POST',
                headers:{
                    'content-type': 'application/json'
                },
                body: JSON.stringify({editnotesForm, editNoteId})
            });
    
            const data = await response.json();

            toast.success(data.message)
         
            setEditNotesForm({
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
    useEffect(()=>{
        async function GetNote(){    
          try {
            const response = await fetch(`http://localhost:9000/note/findOne/${editNoteId}`)

            if(!response.ok){
               return console.log(`response is not okay`)
            }
    
            const data = await response.json();
              
            setEditNotesForm(prev =>({
                ...prev,
            title: data.title,
            content: data.content,
            category: data.category,
            tags: data.tags,
            color: data.color,
            }))
          
            
          } catch (error) {
             console.log(error)
          }
        }
         GetNote()
          }, [])
          

    
        
    const colorOption = ['hsl(45, 90%, 78%)', 'hsl(25, 90%, 78%)', 'hsl(340, 75%, 80%)', 'hsl(270, 65%, 80%)','hsl(205, 80%, 78%)', 'hsl(145, 55%, 76%)']

    return(
      <div className="addNotesPage">
        <div className="notesHeading">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-pen-icon lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
            <div>
                <p>Edit Your Note</p>
                <a>Capture your thoughts and ideas</a>
            </div>
            </div>
            <form onSubmit={(e) =>handleSubmit(e)}>
                <div className="notesEditor">
                    <div>
                        <a>Title</a>
                        <input placeholder="enter notes title..." name="title" value={editnotesForm.title} onChange={(e) => handleChange(e)} />
                    </div>
                    <div>
                        <a>Tags</a>
                        <div className="tagBtn">
                        {editnotesForm.tags.length !== 0  ? editnotesForm.tags.map((element,index) =>( <div><a>{element}</a> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x" onClick={() => removeTag(index)}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </div>)): <></>}
                        {editnotesForm.tags.length < 3 ? <input placeholder="add tags... (max 3 tags)" ref={tagRef} name="tags" /> : <></>}
                        {editnotesForm.tags.length < 3 ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus" onClick={addTag}><path d="M5 12h14"/><path d="M12 5v14"/></svg>: <></>}
                        </div>
                    </div>
                    <div>
                        <a>Category</a>
                        <input placeholder="Select category" name="category" value={editnotesForm.category} onChange={(e) => handleChange(e)} />
                    </div>
                    <div>
                        <a>Colour</a>
                        <div className="colorPick">
                            {colorOption.map((color,index) =>(
                                <div key={index} style={{backgroundColor: `${color}`}} className={selectedColor === color ? `colorOption colorSelected` : `colorOption`} onClick={() => addColor(color)}></div>
                            ))
                            }
                        </div>
                    </div>
                </div>
                <div>
                    <textarea placeholder="text here..." name="content" value={editnotesForm.content} onChange={(e) => handleChange(e)} />
                </div>
                <button disabled={clicked} type="submit">Update</button>
            </form>

        </div>
    )
}

export default EditNotes;