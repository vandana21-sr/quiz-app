import React,{useEffect,useState} from 'react'
export default function Timer({duration=30,onTimeout,resetKey}){
  const [time,setTime]=useState(duration)
  useEffect(()=>{ setTime(duration); const interval=setInterval(()=>{ setTime(t=>{ if(t<=1){ clearInterval(interval); onTimeout(); return 0 } return t-1 }) },1000); return ()=>clearInterval(interval) },[resetKey,duration,onTimeout])
  return <div className="timer">⏳ {time}s</div>
}