import { create } from 'jss';
import { jssPreset, createMuiTheme, responsiveFontSizes } from '@material-ui/core'
import jjsNested from 'jss-plugin-nested';
import appColor from './appColor';

export const jss = create({
  plugins: [...jssPreset().plugins, jjsNested()],
});

export const theme = responsiveFontSizes(createMuiTheme({
  palette: {
    common: {
      // green: `${appColor.green}`,
      white: '#fff',
      black: `${appColor.black}`,
    },
    primary: {
      main: `${appColor.blueStrong}`
    },
    secondary: {
      main: `${appColor.black}`
    }
  },
  typography: {
    htmlFontSize: 10
  },
}));