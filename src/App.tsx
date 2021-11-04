
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { green, yellow } from '@mui/material/colors';
import * as React from 'react';
import ContentMediator from './content/ContentMediator';

interface IProps {
}

export default class App extends React.Component<IProps> {

  theme = createTheme({
    palette: {
      mode: "dark",
      primary: { main: green[600] },
      secondary: { main: yellow[800] }
    }
  });

  public render() {
    return (
      <ThemeProvider  theme={this.theme}>
        <CssBaseline />
        <ContentMediator />
      </ThemeProvider>
    );
  }

}
