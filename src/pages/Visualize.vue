<template>
  <v-sheet color="transparent" class="pt-4" fluid height="100%">
    <v-sheet color="transparent" class="d-flex justify-center flex-wrap" height="100px">
      <v-col :xs="12" :md="4" :xl="2">
        <v-select v-model="scheme" :items="schemes" label="Scheme" variant="outlined"></v-select>
      </v-col>
      <v-col :xs="12" :md="4" :xl="2">
        <v-text-field v-model="num_processes" label="Number of Processes" type="number" variant="outlined">
        </v-text-field>
      </v-col>
      <v-col :xs="12" :md="4" :xl="2">
        <v-text-field v-model="block_size" type="number" label="Elements per data-block" variant="outlined">
        </v-text-field>
      </v-col>
    </v-sheet>
    <v-divider></v-divider>
    <!-- <v-sheet class="d-flex justify-center flex-wrap" height="60">
      <v-chip class="ma-2 pa-2">test</v-chip>
      <v-sheet class="ma-2 pa-2">
        <v-btn color="primary">play</v-btn>
      </v-sheet>
      <v-sheet class="ma-2 pa-2">
        <v-btn color="success">step</v-btn>
      </v-sheet>
      <v-sheet class="ma-2 pa-2">
        <v-btn color="error">stop</v-btn>
      </v-sheet>
      <v-sheet class="ma-2 pa-2">
        <v-btn color="error">reset</v-btn>
      </v-sheet>
    </v-sheet> -->
    <v-sheet color="transparent" class="d-flex justify-center flex-wrap" height="85%">
      <v-col :xs="12" :sm="12" :md="12" :lg="6" height="100%">
        <v-card class="pa-4" variant="outlined" height="100%">
          <v-sheet color="transparent" class="d-flex justify-center" height="40">
            <h2 class="text-center">Data View</h2>
          </v-sheet>
          <v-divider class="pb-4"></v-divider>
          <v-sheet color="transparent" class="d-flex justify-center" height="92%">
            <v-col v-for="n in num_processes">
              <h3 class="text-center pb-2">P{{ n }}</h3>
              <v-row v-for="n in block_size * num_processes" class="py-2 d-flex justify-center"><v-chip>{{ n % block_size}}</v-chip></v-row>
            </v-col>
          </v-sheet>

        </v-card>
      </v-col>
      <v-col :xs="12" :sm="12" :md="12" :lg="6" height="100%">
        <v-card class="pa-4" variant="outlined" height="100%">
          <v-sheet color="transparent" class="d-flex justify-center" height="40">
            <h2 class="text-center">Adjacency Matrix</h2>
          </v-sheet>
          <v-divider class="pb-4"></v-divider>
          <v-sheet color="transparent" class="d-flex justify-center" height="92%">
            
          </v-sheet>
        </v-card>
      </v-col>
    </v-sheet>
    <v-footer app class="">
      <h3 class="text-white">Step:</h3>

      <v-spacer></v-spacer> 

        <v-btn class="mx-4 my-1" color="info">play</v-btn>
        <v-btn class="mx-4" color="success">step</v-btn>
        <v-btn class="mx-4" color="error">stop</v-btn>
        <v-btn class="mx-4" color="error">reset</v-btn>
  </v-footer>
  </v-sheet>
</template>

<script>

export default {
  name: 'Visualize',

  data: () => ({
    scheme: 'Uniform',
    schemes: ['Uniform', 'Non-Uniform'],
    num_processes: 6,
    block_size: 2,
  }),
}
</script>
