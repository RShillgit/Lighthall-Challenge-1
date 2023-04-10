import './App.css';
import { useEffect, useState } from 'react';

function App() {

  const [clickCount, setClickCount] = useState(0);

  // On mount check for preexisting count in local storage
  useEffect(() => {
    const storedCount = Number(localStorage.getItem("count"));

    // If there is a preexisting count, set the count state to that value
    if (storedCount) {
      setClickCount(storedCount);
    }
  }, [])

  // On mount/clickCount change set count value in local storage
  useEffect(() => {
    localStorage.setItem("count", clickCount)
  }, [clickCount])

  return (
    <div className="App">
      <header>
        <h1>Challenge 1: Chasing the Clicks</h1>
      </header>

      <div className="clickCounter-container">
        <div className='clickCounter-main'>
          <p>Count: {clickCount}</p>
          <div className='clickCounter-actions'>
            <button onClick={() => setClickCount(0)}>Reset</button>
            <button onClick={() => setClickCount(clickCount + 1)} id='incrimentButton'>Incriment Count</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
