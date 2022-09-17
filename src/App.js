import './App.css';
import {useState, useRef, useEffect} from 'react'
import useInterval from './useInterval.js'

const BREAK = 'break'
const SESSION = 'session'

function App() {
  const [sessionState, setSessionState] = useState(1500)
  const [breakState, setBreakState] = useState(300)

  const [sessionSeconds, setSessionSeconds] = useState(0)
  const [sessionMinutes, setSessionMinutes] = useState(25)

  const [breakSeconds, setBreakSeconds] = useState(0)
  const [breakMinutes, setBreakMinutes] = useState(5)

  const [isRunning, setIsRunning] = useState(false)
  const [breakIsRunning, setBreakIsRunning] = useState(false)

  const whichIsRunning = useRef(SESSION)
  const [sessionTime, setSessionTime] = useState(sessionState)
  const [breakTime, setBreakTime] = useState(breakState)
  const audioRef = useRef()

    useInterval(() => {
        setSessionMinutes(Math.floor(sessionState/60)) 
        setSessionSeconds(Math.floor(sessionState % 60)) 
        if(sessionState <= 0) {
          setSessionState(0)
          playAudio()
          setBreakState(breakTime)
          setIsRunning(false)
          setBreakIsRunning(true)
          whichIsRunning.current = BREAK
          return
        }
        setSessionState(prev => prev - 1)
    }, isRunning ? 1000 : null)

    useInterval(() => {
      setBreakMinutes(Math.floor(sessionState/60)) 
      setBreakSeconds(Math.floor(sessionState % 60)) 
      if (breakState <= 0) {
        setBreakState(0)
        playAudio()
        setSessionState(sessionTime)
        setIsRunning(true)
        setBreakIsRunning(false)
        whichIsRunning.current = SESSION
        return
      }
      setBreakState(prev => prev - 1)
    }, breakIsRunning ? 1000 : null)

  const increaseSession = () => {
    if(sessionState >= 3600) return
    setSessionState(prev => prev + 60)
    setSessionTime(sessionState + 60)

  }

  const decreaseSession = () => {
    if(sessionState <= 60) return
    setSessionState(prev => prev - 60)
    setSessionTime(sessionState - 60)

  }

  const increaseBreak = () => {
    if(breakState >= 3600) return
    setBreakState(prev => prev + 60)
    setBreakTime(breakState + 60)
    console.log(breakMinutes)

  }

  const decreaseBreak = () => {
    if(breakState <= 60) return
    setBreakState(prev => prev - 60)
    setBreakTime(breakState - 60)
  }

  const startPauseTimer = () => {
    whichIsRunning.current === SESSION ? setIsRunning(!isRunning) : setBreakIsRunning(!breakIsRunning)
    
  }

  const pauseTimer = () => {
    whichIsRunning.current === SESSION ? setIsRunning(false) : setBreakIsRunning(false)
  }

  const resetTimer = () => {
    pauseTimer()
    audioRef.current.pause()
    audioRef.current.currentTime = 0
    setSessionState(1500)
    setBreakState(300)
    whichIsRunning.current = SESSION
  }

function playAudio () {
  audioRef.current.play()
  setTimeout(() => {
    audioRef.current.pause()
  }, 2000);
}
  useEffect(() => {
    setSessionMinutes(Math.floor(sessionState/60)) 
    setSessionSeconds(Math.floor(sessionState % 60)) 
  }, [sessionState])

  useEffect(() => {
    setBreakMinutes(Math.floor(breakState/60)) 
    setBreakSeconds(Math.floor(breakState % 60)) 
  }, [breakState])

  return (
    <div className="App">
      <div className='main-container flex flex-col items-center w-[500px] h-[500px]'>
        <div className='title text-white text-[40px]'>25 + 5 Clock</div>
        <audio ref={audioRef} id='beep' src='https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav'></audio>
        <div className='lenghts flex w-[100%]'>
          <div className='flex w-[50%] flex-col'>
            <div><h2 className='text-[30px] text-white text-center' id='break-label'>Break Length</h2></div>
            <div className='flex justify-center text-white'>
              <button className='px-[10px]' onClick={increaseBreak} id='break-increment'>Up</button>
              <div className='inline-block px-[10px]' id='break-length'>{breakMinutes}</div>
              <button className='px-[10px]' onClick={decreaseBreak} id='break-decrement'>Down</button>
            </div>
          </div>
          <div className='flex w-[50%] flex-col'>
            <div><h2 className='text-[30px] text-white text-center' id="session-label">Session Length</h2></div>
            <div className='flex justify-center text-white'>
              <button className='px-[10px]' onClick={increaseSession} id='session-increment'>Up</button>
              <div className='inline-block px-[10px]' id='session-length'>{sessionMinutes}</div>
              <button className='px-[10px]' onClick={decreaseSession} id='session-decrement'>Down</button>
            </div>
          </div>
        </div>
        <div className='timer w-[50%] flex mt-[10px] justify-center items-center text-white py-[10px] border-black border-solid rounded-[25px] border-[5px] flex-wrap'>
          <h3 className='text-[25px] w-[100%] text-center' id='timer-label'>{whichIsRunning.current === SESSION ? 'Session' : 'Break'}</h3>
          <div className='flex' id='time-left'>
            <h2 className='text-[50px]'>
              {whichIsRunning.current === SESSION && sessionState !== 0 ? `${sessionMinutes.toString().padStart(2, "0")}:${sessionSeconds.toString().padStart(2, "0")}` :
              whichIsRunning.current === BREAK && breakState !== 0 ? `${breakMinutes.toString().padStart(2, "0")}:${breakSeconds.toString().padStart(2, "0")}` : 
              sessionState === 0 || breakState === 0 ? `00:00` : ``}
            </h2>
          </div>
        </div>
        <div className='buttons-container w-[50%] flex mt-[20px] text-white'>
          <button className='flex-1' onClick={startPauseTimer} id='start_stop'>Resume/Pause</button>
          <button className='flex-1' onClick={resetTimer} id='reset'>Reset</button>
        </div>
        <p className='mt-[20px] text-white'>By: Kyle E.F.O.</p>
      </div>
    </div> // audio
  );
}

export default App;
