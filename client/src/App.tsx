import React, {useState, useEffect, useMemo} from 'react';
import logo from './logo.svg';
import './App.css';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';

interface User {
    name: string;
    age: number;
}

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch("http://localhost:8000/api/users");
            const json = await res.json();
            setUsers(json as User[])
        };

        fetchData();
    }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
         <ul>
                {users.map(user => (
                    <li>{user.name}</li>
                ))}
            </ul>
        </Grid>

    </ThemeProvider>

//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
  );
}

export default App;
