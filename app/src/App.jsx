
import { Route, Routes } from "react-router-dom"
import Login from "./pages/login"
import Sign from "./pages/sign"
import Notes from "./pages/myNotes"
import Header from "./components/header"
import AddNotes from "./components/addNotes"
import EditNotes from "./components/editNotes"
import { createContext } from "react"
import { useState } from "react"
import {Toaster} from 'react-hot-toast'

export const editNoteIdContext = createContext();
export const tokenContent = createContext()
export const emailContext = createContext()
export const isloggedContext = createContext()

function App() {

  const[editNoteId, setEditNoteId] = useState("")
  const[token, setToken] = useState()
  const[islogged, setIslogged] = useState(false)


  return (
     <isloggedContext.Provider value={{islogged, setIslogged}}>
<div className="page">
 
  <Header />
  <editNoteIdContext.Provider value={{editNoteId, setEditNoteId}}>
  <tokenContent.Provider value={{token, setToken}}>
    
    <div className="content">
  <Routes>
    <Route path="/" element={<Notes />}></Route>
    <Route path="/login" element={<Login />}></Route>
    <Route path="/sign" element={<Sign/>}></Route>
    <Route path="/note" element={<AddNotes/>}></Route>
    <Route path="/edit" element={<EditNotes/>}></Route>

  </Routes>
  <Toaster />
  </div>
  </tokenContent.Provider>
  </editNoteIdContext.Provider>
</div>
</isloggedContext.Provider>
  )
}

export default App
