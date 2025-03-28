// App.tsx
import React from "react";
import Portfolio from "./components/Portfolio/Portfolio";
import "./App.scss";

const App: React.FC = () => {
  return (
    <div className="container">
      <Portfolio />
    </div>
  );
};

export default App;
