<template>
  <v-app-bar
        color="primary"
        density="compact"
      >
        <template v-slot:prepend>
          <v-app-bar-nav-icon v-if="$route.name === 'visualize'" @click="returnToCollective"><v-icon>mdi-chevron-left</v-icon></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title>{{ title }}</v-app-bar-title>

        <template v-slot:append>
          <v-btn text @click="$router.push({ name: 'home' })">Home</v-btn>
        </template>
      </v-app-bar>
</template>

<script>
import collectives from "../data/collectives.json";

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
        return "MPI Visualizer"
      }
    }
  },
  methods: {
    returnToCollective() {
      const selectedCollective = collectives[this.$route.params.collective]
      this.$router.push({ path: `/c/${selectedCollective.id}` })
    }
  }
}
</script>
