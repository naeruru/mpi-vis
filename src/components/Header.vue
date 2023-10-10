<template>
  <v-app-bar
        color="primary"
        density="compact"
      >
        <template v-slot:prepend>
          <!-- <v-app-bar-nav-icon v-if="$route.name === 'visualize'" @click="returnToCollective"><v-icon>mdi-chevron-left</v-icon></v-app-bar-nav-icon> -->
          <v-btn v-if="$route.name === 'visualize'" @click="returnToCollective" prepend-icon="mdi-chevron-left">
            <span>Back</span>
          </v-btn>
        </template>

        <v-app-bar-title>{{ title }}</v-app-bar-title>

        <template v-slot:append>
          <v-btn icon class="mr-2" @click="toggle_theme">
            <v-icon v-if="$vuetify.theme.name === 'dark'" size="large">mdi-weather-sunny</v-icon>
            <v-icon v-else size="large">mdi-weather-night</v-icon>
          </v-btn>
          <v-btn icon @click="$router.push({ name: 'home' })"><v-icon>mdi-home</v-icon></v-btn>
        </template>
      </v-app-bar>
</template>

<script>
import collectives from "../data/collectives.js";
import page_details from "../data/main_page.js";

import { useTheme } from 'vuetify'
import { useStatesStore } from '../stores/states'

export default {
  name: 'Header',

  data: () => ({
    //
  }),
  computed: {
    title() {
      if (this.$route.name === "visualize") {
        const selectedCollective = collectives[this.$route.params.collective]
        const selectedAlgorithm = selectedCollective.algorithms[this.$route.params.algorithm]
        return `${selectedCollective.name} ー ${selectedAlgorithm.name}`
      } else {
        return page_details.title
      }
    }
  },
  methods: {
    returnToCollective() {
      const selectedCollective = collectives[this.$route.params.collective]
      this.$router.push({ path: `/c/${selectedCollective.id}` })
    },
    toggle_theme() {
      this.theme.global.name.value = this.theme.global.current.value.dark ? 'light' : 'dark'
      this.statesStore.theme = this.theme.global.name.value
    }
  },
  setup() {
    const statesStore = useStatesStore()
    const theme = useTheme()

    return {
      statesStore,
      theme
    }
  }
}
</script>
