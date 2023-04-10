import './App.css';
import { useState } from 'react';

function App() {

  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="App">
      <header>
        <h1>Challenge 1: Chasing the Clicks</h1>
      </header>

      <div className="clickCounter-container">
        <p>Count: {clickCount}</p>
        <button id='incrimentButton'>Incriment Count</button>
      </div>
    </div>
  );
}

export default App;
