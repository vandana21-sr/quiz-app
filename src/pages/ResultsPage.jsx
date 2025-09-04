import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
export default function ResultsPage(){
  const [summary,setSummary] = useState({questions:[],answers:[]})
  const [highScores,setHighScores] = useState([])
  useEffect(()=>{
    async function load(){
      try{
        const questions = await fetch('/questions.json').then(r=>r.json())
        const answers = JSON.parse(sessionStorage.getItem('quiz_answers')||'[]')
        setSummary({questions,answers})
        const score = answers.filter(a=>a?.isCorrect).length
        const prev = JSON.parse(localStorage.getItem('highScores')||'[]')
        const newScores = [...prev,{score,date:new Date().toLocaleString()}].sort((a,b)=>b.score-a.score).slice(0,5)
        localStorage.setItem('highScores', JSON.stringify(newScores))
        setHighScores(newScores)
      }catch(e){}
    }
    load()
  },[])
  if(!summary.questions.length) return <div className="card">No results yet. <Link to='/'>Start Quiz</Link></div>
  const score = summary.answers.filter(a=>a?.isCorrect).length
  return (
    <div className="card">
      <h2>🎯 You scored <strong>{score}</strong> / {summary.questions.length}</h2>
      <p>{score===summary.questions.length ? '🏆 Perfect!':'Keep trying — you can improve!'}</p>
      <div className="results-list">
        {summary.questions.map((q,i)=>(
          <div key={i} className="result-item">
            <div dangerouslySetInnerHTML={{__html:`Q${i+1}: ${q.question}`}} />
            <div className="meta">Your answer: {summary.answers[i]?.selectedIndex!=null ? q.options[summary.answers[i].selectedIndex] : 'Not answered'}</div>
            {!summary.answers[i]?.isCorrect && <div className="meta">Correct: {q.options[q.correctIndex]}</div>}
          </div>
        ))}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:12}}>
        <Link to='/' className="restart-btn" onClick={()=>sessionStorage.removeItem('quiz_answers')}>🔄 Restart</Link>
        <div style={{textAlign:'right'}}>
          <h4 style={{margin:0}}>High Scores</h4>
          <ol>
            {highScores.map((hs,i)=>(<li key={i}>{hs.score} — {hs.date}</li>))}
          </ol>
        </div>
      </div>
    </div>
  )
}