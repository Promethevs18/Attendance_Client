import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { useEffect, useState } from "react";
import { auth } from "./firebase"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./Scenes/Dashboard";

function App() {
  const [theme, colorMode] = useMode();
  const [user, setUser] = useState(null);
  const [active, setActive] = useState("Dashboard");
  const [isSidebar, setIsSidebar] = useState(true);

  useEffect(() =>{
    auth.onAuthStateChanged((authUser) =>{
      if(authUser){
        setUser(authUser);
      }
      else{
        setUser(null);
      }
    })
  },[])


  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <div className="app">
          <main className="content">
            <ToastContainer position="top-center" theme="colored" autoClose={3000}/>
            <Dashboard/>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
