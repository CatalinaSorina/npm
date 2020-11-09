import './App.css';
import { useState } from 'react';
// import FormInput from 'cool-react-components';

function App() {
  const [email, setEmail] = useState();
  return (
    <div className="App">
      <input
        type="text"
        value={email}
        onChange={({ target }) => setEmail(target.value)}
      />
      <input type="submit" disabled={email === ''} />
    </div>
  );
}

export default App;
