<template>
  <v-sheet color="transparent" class="pt-4" fluid height="100%">
    <v-form ref="settingsForm" v-model="valid_options" lazy-validation>
      <v-sheet color="transparent" class="d-flex justify-center flex-wrap" height="100px">
          <v-col v-if="algorithm.scheme" :xs="12" :md="4" :xl="2">
            <v-select v-model="scheme" :items="algorithm.scheme" label="Scheme" variant="outlined" :disabled="true"></v-select>
          </v-col>
          <v-col :xs="12" :md="4" :xl="2">
            <v-text-field v-model="num_processes" :disabled="started" label="Number of Processes" type="number" variant="outlined" :rules="num_processes_rules" required>
            </v-text-field>
          </v-col>
          <v-col :xs="12" :md="4" :xl="2">
            <v-text-field v-model="block_size" :disabled="started" type="number" label="Elements per data-block" variant="outlined" :rules="block_size_rules" required>
            </v-text-field>
          </v-col>
      </v-sheet>
    </v-form>
    <v-divider></v-divider>
    <v-sheet color="transparent" class="d-flex justify-center flex-wrap">
      
      <v-col :cols="(dataViewMinimized) ? 12 : 'auto'" height="100%">
        <v-card class="pa-2" variant="outlined" min-height="100%" min-width="20vw">
          <v-sheet color="transparent" class="d-flex justify-center" height="20">
            <v-spacer></v-spacer>
            <v-btn icon="mdi-minus" variant="text" size="x-small" @click="dataViewMinimized = true"></v-btn>
            <v-btn icon="mdi-window-maximize" variant="text" class="ml-2" size="x-small" @click="dataViewMinimized = false"></v-btn>
          </v-sheet>
          <v-sheet color="transparent" class="d-flex justify-center" height="40">
            <h2 v-if="algorithm.receive_buffer" class="text-center">Send Buffer</h2>
            <h2 v-else class="text-center">Data View</h2>
          </v-sheet>
          <v-divider v-if="!dataViewMinimized" class="pb-4"></v-divider>
          <v-sheet v-if="!dataViewMinimized" color="transparent" class="d-flex justify-center" height="92%">
            <v-col v-for="p in processes" width="100%">
              <h3 class="text-center pb-2">P{{ p.id }}</h3>
              <v-row v-for="block in p.blocks" class="py-2 d-flex justify-center">
                <v-chip class="mb-1" :label="block.status >= 1" size="small" :variant="(block.status === 2) ? 'tonal' : 'outlined'" :color="colors[block.color]" text-color="white">
                  <b v-if="block.status >= 1" class="red--text text--lighten-5">{{ block.id }}</b>
                  <p v-else>{{ block.id }}</p>
                </v-chip>
              </v-row>
            </v-col>
          </v-sheet>
        </v-card>
      </v-col>


      <v-col v-if="algorithm.receive_buffer" :cols="(adjMatrixMinimized) ? 12 : 'auto'" height="100%">
        <v-card class="pa-2" variant="outlined" height="100%" min-width="20vw">
          <v-sheet color="transparent" class="d-flex justify-center" height="20">
            <v-spacer></v-spacer>
            <v-btn icon="mdi-minus" variant="text" size="x-small" @click="adjMatrixMinimized = true"></v-btn>
            <v-btn icon="mdi-window-maximize" variant="text" class="ml-2" size="x-small" @click="adjMatrixMinimized = false"></v-btn>
          </v-sheet>
          <v-sheet color="transparent" class="d-flex justify-center" height="40">
            <h2 class="text-center">Receive Buffer</h2>
          </v-sheet>
          <v-divider v-if="!adjMatrixMinimized" class="pb-4"></v-divider>
          <v-sheet v-if="!adjMatrixMinimized" color="transparent" class="d-flex justify-center" height="92%">
            <v-col v-for="p in processes" width="100%">
              <h3 class="text-center pb-2">P{{ p.id }}</h3>
              <v-row v-for="block in p.receive_buffer" class="py-2 d-flex justify-center">
                <v-chip v-if="block" class="mb-1" :label="block.status >= 1" size="small" :variant="(block.status === 2) ? 'tonal' : 'outlined'" :color="colors[block.color]" text-color="white">
                  <b v-if="block.status >= 1" class="red--text text--lighten-5">{{ block.id }}</b>
                  <p v-else>{{ block.id }}</p>
                </v-chip>
                <v-chip v-else class="mb-1" size="small" label>--</v-chip>
              </v-row>
            </v-col>
          </v-sheet>
        </v-card>
      </v-col>

      <v-col v-else :cols="(adjMatrixMinimized) ? 12 : 'auto'" height="100%">
        <v-card class="pa-2" variant="outlined" height="100%" min-width="20vw">
          <v-sheet color="transparent" class="d-flex justify-center" height="20">
            <v-spacer></v-spacer>
            <v-btn icon="mdi-minus" variant="text" size="x-small" @click="adjMatrixMinimized = true"></v-btn>
            <v-btn icon="mdi-window-maximize" variant="text" class="ml-2" size="x-small" @click="adjMatrixMinimized = false"></v-btn>
          </v-sheet>
          <v-sheet color="transparent" class="d-flex justify-center" height="40">
            <h2 class="text-center">Adjacency Matrix</h2>
          </v-sheet>
          <v-divider v-if="!adjMatrixMinimized" class="pb-4"></v-divider>
            <v-table v-if="!adjMatrixMinimized">
              <thead>
                <tr>
                  <th class="text-left">
                    
                  </th>
                  <th v-for="p in processes">
                    P{{ p.id }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="p in processes"
                  :key="p.id"
                >
                  <td>P{{ p.id }}</td>
                  <td v-for="status in p.statuses">
                    <v-chip :color="getStatusColor(status.status)" size="x-small" :label="!status.status" variant="outlined">{{ (status.status === 0) ? 0 : 1 }}</v-chip>
                  </td>
                </tr>
              </tbody>
            </v-table>
            <v-sheet v-if="!adjMatrixMinimized" color="transparent" class="d-flex justify-center pt-2" height="40">
              <v-chip class="mx-1" size="small" color="green" prepend-icon="mdi-circle" variant="outlined" label>Send</v-chip>
              <v-chip class="mx-1" size="small" color="red" prepend-icon="mdi-circle" variant="outlined" label>Receive</v-chip>
              <v-chip class="mx-1" size="small" color="blue-grey" prepend-icon="mdi-circle" variant="outlined" label>Previous Step</v-chip>
            </v-sheet>
        </v-card>
      </v-col>
    </v-sheet>
    <v-footer app class="d-flex flex-column">
      <div class="d-flex w-100 align-center">
        <h3 class="text-white mr-4">{{ step.text }}</h3>

        <v-menu
          :close-on-content-click="false"
          location="top"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              icon
              size="x-small"
              variant="outlined"
              v-bind="props"
            >
              <v-icon>mdi-help</v-icon>
            </v-btn>
          </template>

          <v-card max-width="500">
            <v-card-title>{{ step.text }}</v-card-title>
            <v-card-text v-html="step.subtext"></v-card-text>
          </v-card>

        </v-menu>

        <v-spacer></v-spacer> 

        <v-btn :disabled="running || done || !valid_options" :loading="running" class="mx-2" color="info" @click="play">
          play
        </v-btn>
        <v-btn :disabled="done || !valid_options" class="mx-2" color="success" @click="runStep">
          step
        </v-btn>
        <v-btn :disabled="!running || !started" class="mx-2" color="error" @click="stop">
          stop
        </v-btn>
        <v-btn :disabled="!started" class="mx-2" color="error" @click="reset">
          reset
        </v-btn>
      </div>
    </v-footer>
  </v-sheet>
</template>

<script>

import collectives from "../data/collectives.json";
import algorithms from "../helpers/algorithms.js"

export default {
  name: 'Visualize',

  data: () => ({

    valid_options: true,

    timer: null,
    timerInterval: 0,

    started: false, // has vis started
    running: false, // is vis auto running
    done: false, // is vis done

    k: 0, 
    step: null,

    processes: null,


    scheme: null,

    num_processes: 16,
    process_selects: Array.from({length: 16}, (_, i) => i + 1),
    block_size: 1,

    dataViewMinimized: false,
    adjMatrixMinimized: false,

    colors: ['blue', 'orange', 'green', 'red', 'yellow', '#B388FF', 'cyan', '#E6EE9C', 'grey', '#64FFDA', 'white', 
            '#76FF03', '#80CBC4', '#FFE082', '#00E676', '#6200EA', '#F48FB1', 'brown', '#546E7A', '#FF9E80', '#B9F6CA', 
            '#00BFA5', '#C51162', '#FFCDD2', '#1B5E20', '#D500F9', '#F50057', '#827717', '#00E5FF', '#304FFE',
            '#beb0f8', '#f1dcb0'],

    num_processes_rules: [
      v => !!v || "This field is required",
      v => ( v <= 32 ) || `Must be 32 or lower`,
      v => ( v >= 2 ) || `Must be greater than 1`
    ],
    block_size_rules: [
      v => !!v || "This field is required",
      v => ( v <= 4 ) || `Must be 4 or lower`,
      v => ( v > 0 ) || `Must be greater than 0`
    ]
  }),
  computed: {
    algorithm() {
      const collective = this.$route.params.collective
      const algorithm = this.$route.params.algorithm
      return collectives[collective].algorithms[algorithm]
    },
  },
  watch: {
    num_processes(oldNum, newNum) {
        if (this.num_processes <= 32 && this.block_size <= 4) {
          this.processes = this.generateDataSet()
          if (this.algorithm.receive_buffer)
            this.receive_buffer = this.generateRBuffer()
        }
    },
    block_size(oldNum, newNum) {
      if (this.num_processes <= 32 && this.block_size <= 4) {
          this.processes = this.generateDataSet()
          if (this.algorithm.receive_buffer)
            this.receive_buffer = this.generateRBuffer()
        }
    }
  },
  methods: {
    getStatusColor(status) {
      switch(status){
        case 0:
          return "white"
        case 1:
          return "green"
        case 2:
          return "red"
        case 3:
          return "blue-grey"
        default:
          return "white"
      }
    },
    play() {
      this.started = true
      this.running = true
      this.timer = setInterval(() => this.runStep(), 1500)
    },
    stop() {
      this.running = false
      clearInterval(this.timer)
      this.timer = null
    },
    reset() {
      this.started = false
      this.running = false
      this.done = false
      this.k = 0
      clearInterval(this.timer)
      this.step = {
        id: 0,
        substep: 0,
        text: "Initial Data",
        subtext: "Initial Data setup"
      }
    this.processes = this.generateDataSet()
    },
    async runStep() {
      this.started = true
      const collective = this.$route.params.collective
      const algorithm = this.$route.params.algorithm
      await algorithms[collective][algorithm](this.processes, this.k, this.step, this.num_processes, this.block_size).then(data => {
        this.k = data.k
        this.step = data.step
        if (data.done) {
          this.stop()
        }
      })
    },
    generateDataSet() {
      if (!this.num_processes || !this.block_size) return

      this.num_processes = parseInt(this.num_processes)
      this.block_size = parseInt(this.block_size)
      const data = Array(this.num_processes).fill().map(() => ({}))
      const blocks = Array(this.block_size * this.num_processes).fill().map(() => ({}))
      // status 0 == untouched, status 1 == sent, status 2 == received, status 3 == something happened in previous step
      const statuses = Array(this.num_processes).fill().map(() => ({ status: 0 }))

      let receive_buffer
      if (this.algorithm.receive_buffer)
        receive_buffer = Array(this.block_size * this.num_processes).fill().map(() => (null))

      blocks.forEach((_, i) => {
        blocks[i].color = Math.floor(i / this.block_size)
      })
      data.forEach((_, i) => {
        data[i].id = i
        data[i].blocks = structuredClone(blocks)
        data[i].statuses = structuredClone(statuses)

        if (receive_buffer)
          data[i].receive_buffer = structuredClone(receive_buffer)

        data[i].blocks.map(block => {
          block.id = data[i].id
          block.status = 0
          return block
        })
      })
      
      return data
    },
    generateRBuffer() {
      if (!this.num_processes || !this.block_size) return

      this.num_processes = parseInt(this.num_processes)
      this.block_size = parseInt(this.block_size)
      const data = Array(this.num_processes).fill().map(() => ({}))
      const blocks = Array(this.block_size * this.num_processes).fill().map(() => (null))
      data.forEach((_, i) => {
        data[i].id = i
        data[i].blocks = structuredClone(blocks)
      })
      
      return data
    }
  },
  beforeMount() {
    this.reset()
    if (this.algorithm.scheme)
      this.scheme = this.algorithm.scheme[0]
  },
  mounted() {
    this.$refs.settingsForm.validate()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  }
}
</script>