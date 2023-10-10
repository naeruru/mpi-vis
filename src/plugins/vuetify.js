// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#faeff5',
          surface: '#f2e6ed',
          container: '#e3c8d7',
          primary: '#bb86fc',
          secondary: '#fcb6cc',
          error: '#EF5350',
          info: '#4FC3F7',
          success: '#66BB6A',
          warning: '#FFA726',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#bb86fc'
        }
      }
    }
  }
})
