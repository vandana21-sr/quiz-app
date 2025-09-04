import React from 'react'
import { useNavigate } from 'react-router-dom'
export default function StartPage(){
  const nav = useNavigate()
  return (
    <div className="card" style={{textAlign:'center'}}>
      <h2>Welcome!</h2>
      <p>Try this quick general knowledge quiz. Ready?</p>
      <button className="next-btn" style={{marginTop:12}} onClick={()=>nav('/quiz')}>▶ Click to Play Quiz</button>
    </div>
  )
}