<template>
  <v-app>
    <v-main>
      <router-view name="Header"></router-view>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>

import { useTheme } from 'vuetify'

import { useStatesStore } from './stores/states'

export default {
  name: 'App',

  data: () => ({
    //
  }),
  setup() {
    const statesStore = useStatesStore()
    const theme = useTheme()

    statesStore.$subscribe((_, state) => {
        localStorage.setItem('states', JSON.stringify(state))
    })
    statesStore.$patch(JSON.parse(localStorage.getItem('states') || '{}'))

    theme.global.name.value = statesStore.theme
  }
}
</script>

<style>
p {
  font-size: 18px;
  line-height: 1.4;
}
</style>
