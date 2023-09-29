// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#faeff5',
          surface: '#f2e6ed',
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
