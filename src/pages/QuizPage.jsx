import React, { useEffect, useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { quizReducer, initialState } from '../reducer'
import QuestionCard from '../components/QuestionCard'
import Timer from '../components/Timer'
export default function QuizPage(){
  const [state, dispatch] = useReducer(quizReducer, initialState)
  const [resetKey, setResetKey] = useState(0)
  const nav = useNavigate()
  useEffect(()=>{
    async function load(){
      try{
        const res = await fetch('https://opentdb.com/api.php?amount=10&type=multiple')
        if(res.ok){
          const json = await res.json()
          const normalized = json.results.map((q,i)=>{
            const opts = [...q.incorrect_answers, q.correct_answer].sort(()=>Math.random()-0.5)
            return { id:i+1, question: q.question, options: opts, correctIndex: opts.indexOf(q.correct_answer) }
          })
          dispatch({type:'LOAD_QUESTIONS', payload: normalized})
          return
        }
      }catch(e){}
      try{
        const local = await fetch('/questions.json').then(r=>r.json())
        dispatch({type:'LOAD_QUESTIONS', payload: local})
      }catch(err){
        dispatch({type:'SET_ERROR', payload: 'Failed to load questions'})
      }
    }
    load()
  },[])
  useEffect(()=>{ sessionStorage.setItem('quiz_answers', JSON.stringify(state.answers)) },[state.answers])
  if(state.loading) return <div className="card">Loading...</div>
  if(state.error) return <div className="card">Error: {state.error}</div>
  const q = state.questions[state.currentIndex]
  const selected = state.answers[state.currentIndex]?.selectedIndex ?? null
  function handleSelect(i){ if(state.locked) return; dispatch({type:'SELECT_ANSWER', payload:i}) }
  function handleNext(){ if(state.currentIndex === state.questions.length-1){ nav('/results'); return } dispatch({type:'NEXT'}); setResetKey(k=>k+1) }
  function handleTimeout(){ if(!state.locked) dispatch({type:'SELECT_ANSWER', payload:null}) }
  return (
    <div className="card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <Timer duration={30} onTimeout={handleTimeout} resetKey={resetKey} />
          <span className="progress" style={{marginLeft:12}}>Question {state.currentIndex+1} of {state.questions.length}</span>
        </div>
        <div style={{color:'#64748b',fontWeight:600}}>Done: {state.currentIndex} | Left: {state.questions.length - (state.currentIndex)}</div>
      </div>
      <QuestionCard question={q} locked={state.locked} onSelect={handleSelect} selectedIndex={selected} />
      <div className="controls">
        <div></div>
        <button className="next-btn" disabled={!state.locked} onClick={handleNext}>{state.currentIndex===state.questions.length-1?'Finish':'Next'}</button>
      </div>
    </div>
  )
}