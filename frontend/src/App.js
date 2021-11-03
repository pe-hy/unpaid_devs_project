function App() {
    const name = 'Petr'
    const xy = true

  return (
    <div className="App">
      <h1>Hello from React</h1>
        <h2>Hello {xy ? 'Yes' : "No"}</h2>
    </div>
  );
}

export default App;
