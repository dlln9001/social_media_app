import './App.css';

function App() {
  fetch('http://127.0.0.1:8000/api/')
  .then((res) => res.json())
  .then((data) => {
    console.log(data)
  })
  .catch(error => {
    console.error("Error fetching data: ", error)
  })
  return (
    <>
      <div>
        Hello, alskdfj
      </div>
    </>
  );
}

export default App;
