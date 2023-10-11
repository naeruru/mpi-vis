<template>
  <v-sheet color="transparent" class="pt-4" fluid height="100%">

    <v-form ref="settingsForm" v-model="valid_options" lazy-validation>
      <v-sheet color="transparent" class="d-flex justify-center flex-wrap">
        <v-col :cols="6" :xs="12" :sm="6" :md="4" :xl="2" class="py-2">
          <v-text-field v-model="statesStore.num_processes" :disabled="statesStore.started" label="Number of Processes"
            type="number" variant="outlined" :rules="num_processes_rules" required density="compact">
          </v-text-field>
        </v-col>
        <v-col :cols="6" :xs="12" :sm="6" :md="4" :xl="2" class="py-2">
          <v-text-field v-model="statesStore.block_size" :disabled="statesStore.started" type="number"
            label="Elements per data-block" variant="outlined" :rules="block_size_rules" required density="compact">
          </v-text-field>
        </v-col>
        <v-col v-if="statesStore.algorithm.options.radix" :cols="12" :xs="12" :sm="12" :md="4" :xl="2" class="py-2">
          <v-text-field v-model="statesStore.radix" :disabled="statesStore.started" type="number"
            label="Radix r" variant="outlined" :rules="radix_rules" required density="compact">
          </v-text-field>
        </v-col>
      </v-sheet>
    </v-form>
    <v-divider></v-divider>
    <v-sheet color="transparent" class="d-flex justify-center flex-wrap">

      <v-col class="pr-2" :cols="(dataViewMinimized) ? 12 : 6" height="100%">
        <v-card class="pa-1 mb-2" :variant="$vuetify.theme.name === 'dark' ? 'outlined' : undefined" min-height="100%" min-width="20vw">
          <v-sheet color="transparent" class="d-flex justify-center" height="20">
            <v-spacer></v-spacer>
            <v-btn
              :icon="(dataViewMinimized) ? `mdi-minus` : `mdi-checkbox-multiple-blank-outline`"
              variant="text"
              size="x-small"
              @click="dataViewMinimized = !dataViewMinimized"
            ></v-btn>
          </v-sheet>
          <v-sheet color="transparent" class="d-flex justify-center" height="40">
            <h2 v-if="statesStore.algorithm.receive_buffer" class="text-center">Send Buffer</h2>
            <h2 v-else class="text-center">Data View</h2>
          </v-sheet>
          <v-divider class="pb-4"></v-divider>
          <v-sheet color="transparent" class="d-flex justify-left overflow-x-auto" height="92%">
            <v-col v-if="statesStore.algorithm.options.binary && (statesStore.num_processes && statesStore.radix)" class="justify-right">
              <h4 class="text-center pb-2"><code>B</code></h4>
              <v-row v-for="(block, i) in statesStore.processes[0].blocks" class="py-2 d-flex justify-center">
                <v-chip v-if="statesStore.radix > 1 && statesStore.radix < 36 " size="small" variant="text" label :color="(block.status > 0 || !statesStore.started) ? 'primary' : 'black'">
                  {{ ('00000' + i.toString(statesStore.radix)).slice(-Math.ceil(Math.log2(statesStore.num_processes))) }}
                </v-chip>
              </v-row>
            </v-col>
            <v-col v-for="p in statesStore.processes" width="100%">
              <h4 class="text-center pb-2"><code>P{{ (p.id < 10) ? `0${p.id}` : p.id }}</code></h4>
              <v-row v-for="block in p.blocks" class="py-2 d-flex justify-center">
                <v-chip :class="{ 'blink-2': block.status === 2 }" :style="{ 'border-width': border_width(block.status) }" :label="block.status >= 1" size="small"
                  :variant="(block.status === 2) ? 'tonal' : 'outlined'" :color="colors[block.color]">
                  <v-avatar class="font-weight-black text-subtitle-2">
                    {{ block.id }}
                  </v-avatar>
                  <!-- <strong>{{ block.id }}</strong> -->
                </v-chip>
              </v-row>
            </v-col>
          </v-sheet>
        </v-card>
      </v-col>

      <v-col v-if="statesStore.algorithm.receive_buffer" class="pl-2" :cols="(adjMatrixMinimized) ? 12 : 6" height="100%">
        <v-card class="pa-1" :variant="$vuetify.theme.name === 'dark' ? 'outlined' : undefined" min-height="100%" min-width="20vw">
          <v-sheet color="transparent" class="d-flex justify-center" height="20">
            <v-spacer></v-spacer>
            <v-btn
              :icon="(adjMatrixMinimized) ? `mdi-minus` : `mdi-checkbox-multiple-blank-outline`"
              variant="text"
              size="x-small"
              @click="adjMatrixMinimized = !adjMatrixMinimized"
            ></v-btn>
          </v-sheet>
          <v-sheet color="transparent" class="d-flex justify-center" height="40">
            <h2 v-if="statesStore.algorithm.receive_buffer" class="text-center">Receive Buffer</h2>
            <h2 v-else class="text-center">Data View</h2>
          </v-sheet>
          <v-divider class="pb-4"></v-divider>
          <v-sheet color="transparent" class="d-flex justify-left overflow-x-auto"
            height="92%">
            <v-col v-for="p in statesStore.processes" width="100%">
              <h4 class="text-center pb-2"><code>P{{ (p.id < 10) ? `0${p.id}` : p.id }}</code></h4>
              <v-row v-for="block in p.receive_buffer" class="py-2 d-flex justify-center">
                <v-chip v-if="block" :class="{ 'thick-border': block.status === 1 }" :label="block.status >= 1" size="small"
                  :variant="(block.status === 2) ? 'tonal' : 'outlined'" :color="colors[block.color]">
                  <v-avatar tile size="15">{{ block.id }}</v-avatar>
                  <!-- <strong>{{ block.id }}</strong> -->
                </v-chip>
                <v-chip v-else size="small" label>--</v-chip>
              </v-row>
            </v-col>
          </v-sheet>
        </v-card>
      </v-col>

      <v-col v-else class="pl-2" :cols="(adjMatrixMinimized) ? 12 : 6" height="100%">
        <v-card class="py-1" :variant="$vuetify.theme.name === 'dark' ? 'outlined' : undefined" height="100%" min-width="20vw">
          <v-sheet color="transparent" class="d-flex justify-center" height="20">
            <v-spacer></v-spacer>
            <v-btn
              :icon="(adjMatrixMinimized) ? `mdi-minus` : `mdi-checkbox-multiple-blank-outline`"
              variant="text"
              size="x-small"
              @click="adjMatrixMinimized = !adjMatrixMinimized"
            ></v-btn>
          </v-sheet>
          <v-sheet color="transparent" class="d-flex justify-center" height="40">
            <h2 class="text-center">Adjacency Matrix</h2>
          </v-sheet>
          <v-divider class="pb-4"></v-divider>
          <v-table density="compact">
            <thead>
              <tr>
                <th class="text-left"></th>
                <th v-for="p in statesStore.processes" class="px-3 py-1">
                  <code>P{{ (p.id < 10) ? `0${p.id}` : p.id }}</code>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in statesStore.processes" :key="p.id">
                <td><code>P{{ (p.id < 10) ? `0${p.id}` : p.id }}</code></td>
                <td v-for="status in p.statuses">
                  <v-chip class="my-3" :color="getStatusColor(status.status)" size="x-small" :label="!status.status"
                    variant="outlined">{{ (status.status === 0) ? 0 : 1 }}</v-chip>
                </td>
              </tr>
            </tbody>
          </v-table>
          <v-sheet v-if="!adjMatrixMinimized" color="transparent" class="d-flex justify-center pt-2" height="40">
            <v-chip class="mx-1" size="small" color="green" prepend-icon="mdi-circle" variant="outlined"
              label>Send</v-chip>
            <v-chip class="mx-1" size="small" color="red" prepend-icon="mdi-circle" variant="outlined"
              label>Receive</v-chip>
            <v-chip class="mx-1" size="small" color="blue-grey" prepend-icon="mdi-circle" variant="outlined"
              label>Previous Step</v-chip>
          </v-sheet>
        </v-card>
      </v-col>
    </v-sheet>


    <v-navigation-drawer
      v-if="!smAndDown"
      v-model="statesStore.drawer"
      app
      permanent
      temporary
    >
      <v-list-item nav class="mt-12">
        <template v-slot:prepend>
          <v-icon class="ml-1 my-2" color="primary" size="large" icon="mdi-information-outline"></v-icon>
        </template>
        <v-list-item-title>Info</v-list-item-title>
      </v-list-item>

      <v-sheet flat max-width="500">
        <v-card-text class="infotext" v-html="statesStore.step.subtext"></v-card-text>
      </v-sheet>

      <v-divider></v-divider>
      <v-card-title>
        Stats
      </v-card-title>

        <v-list>
          <v-list-item title="Total blocks moved">
            <template v-slot:append>
              <span class="text-primary">{{ statesStore.data_moved }}</span>
            </template>
          </v-list-item>
          <v-list-item title="Comm Step (K)">
            <template v-slot:append>
              <span class="text-primary">{{ statesStore.k }}</span>
            </template>
          </v-list-item>
        </v-list>

      <v-btn v-if="statesStore.algorithm.options.graph" height="55" variant="tonal" color="primary" block @click="toggle_graph">
        View Graph
      </v-btn>
    </v-navigation-drawer>

    
    <BlocksMovedDialog v-model="graph_dialog" :processes="statesStore.num_processes"></BlocksMovedDialog>

    <WelcomeOverlay :overlay="overlay_main" :page="overlay_page"></WelcomeOverlay>

    <!-- <ControlFooter
      :title="step.text"
      :data_pending="data_pending"
      :data_moved="data_moved"
      :description="step.subtext"
    ></ControlFooter> -->
    <v-footer app class="d-flex flex-column">
      <div class="pb-3 text-center w-100 d-md-none">
        <v-menu :close-on-content-click="false" location="top">
          <template v-slot:activator="{ props }">
            <v-btn block variant="outlined" v-bind="props">
              {{ statesStore.step.text }}
            </v-btn>
          </template>

          <v-card max-width="500">
            <v-card-item>
              <v-card-title>{{ statesStore.step.text }}</v-card-title>
              <v-card-subtitle>
                <p v-if="statesStore.data_pending === 0">{{ statesStore.data_moved }} total blocks moved</p>
                <p v-else>{{ statesStore.data_moved }} total blocks moved ({{ statesStore.data_pending }} sending)</p>
              </v-card-subtitle>
            </v-card-item>
            <v-divider class="mx-4"></v-divider>
            <v-card-text class="text-subtitle-1" v-html="statesStore.step.subtext"></v-card-text>
          </v-card>

        </v-menu>
      </div>
      <div class="d-flex w-100 align-center">

        <v-btn class="d-none d-md-flex" icon size="x-small" variant="outlined" @click="statesStore.drawer = !statesStore.drawer">
          <v-icon>mdi-help</v-icon>
        </v-btn>

        <h3 class="mx-2 d-none d-md-flex">{{ statesStore.step.text }}</h3>

        <v-chip class="mr-1 d-none d-md-flex" color="primary">{{ statesStore.data_moved }} total blocks
          transfered</v-chip>
        <v-chip class="d-none d-md-flex">
          <v-progress-circular v-if="statesStore.step.substep === 1" class="mr-1" indeterminate :size="21"
            :width="1"></v-progress-circular>
          <v-icon v-if="statesStore.step.substep === 2" class="mr-1">mdi-check</v-icon>
          {{ statesStore.data_pending }} blocks transferring this step
        </v-chip>

        <v-spacer></v-spacer>

        <v-btn :disabled="!statesStore.started" class="mr-4" color="success" @click="statesStore.runStep(true)" size="small" icon
          variant="outlined">
          <v-icon size="large">mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn :disabled="statesStore.done || !valid_options" class="mr-4" color="success" @click="statesStore.runStep()"
          size="small" icon variant="outlined">
          <v-icon size="large">mdi-chevron-right</v-icon>
        </v-btn>

        <v-divider vertical class="mr-3"></v-divider>

        <div class="d-flex justify-center align-baseline">
          <v-btn :disabled="statesStore.running || statesStore.done || !valid_options" :loading="statesStore.running"
            class="mr-4" color="info" @click="statesStore.play" size="small" icon variant="outlined">
            <v-icon size="large">mdi-play</v-icon>
          </v-btn>
          <v-btn :disabled="!statesStore.running || !statesStore.started" class="mr-4" color="error"
            @click="statesStore.stop" size="small" icon variant="outlined">
            <v-icon size="large">mdi-pause</v-icon>
          </v-btn>
          <v-btn :disabled="!statesStore.started" color="error" @click="statesStore.reset" size="small" icon
            variant="outlined">
            <v-icon size="large">mdi-stop</v-icon>
          </v-btn>

        </div>
      </div>
    </v-footer>
  </v-sheet>
</template>

<script>

import { useStatesStore } from '../stores/states'

import { useDisplay } from 'vuetify'

import BlocksMovedDialog from "../components/dialogs/BlocksMovedDialog.vue"
import WelcomeOverlay from "../components/overlays/WelcomeOverlay.vue"

export default {
  name: 'Visualize',

  components: { BlocksMovedDialog, WelcomeOverlay },
  data() {
    return {
      overlay_main: false,
      overlay_page: 0,

      valid_options: true,

      scheme: null,

      dataViewMinimized: false,
      adjMatrixMinimized: false,

      outer_size: 200,

      graph_dialog: false,

      num_processes_rules: [
        v => !!v || "This field is required",
        v => (v <= 32) || `Must be 32 or lower`,
        v => (v >= 2) || `Must be greater than 1`
      ],
      block_size_rules: [
        v => !!v || "This field is required",
        v => (v <= 4) || `Must be 4 or lower`,
        v => (v > 0) || `Must be greater than 0`
      ],
      radix_rules: [
        v => !!v || "This field is required",
        v => (v < this.statesStore.num_processes) || `Must be less than process count`,
        v => (v > 1) || `Must be greater than 1`
      ]
    }
  },
  computed: {
    colors() {
      if (this.$vuetify.theme.name === 'dark') {
        return ['#6961ff', 'orange', 'green', 'red', 'yellow', '#B388FF', 'cyan', '#E6EE9C', 'grey', '#64FFDA', 'white',
          '#76FF03', '#80CBC4', 'blue', '#00E676', '#6200EA', '#F48FB1', 'brown', '#546E7A', '#FF9E80', '#B9F6CA',
          '#00BFA5', '#C51162', '#FFCDD2', '#1B5E20', '#D500F9', '#F50057', '#827717', '#00E5FF', '#304FFE',
          '#beb0f8', '#f1dcb0']
      } else {
        return ['#6961ff', 'orange', 'green', 'red', 'yellow-accent-4', '#B388FF', 'cyan', '#bf00a6', 'grey', '#64FFDA', 'black',
          '#76FF03', '#80CBC4', 'blue', '#00E676', '#6200EA', '#F48FB1', 'brown', '#546E7A', '#FF9E80', '#B9F6CA',
          '#00BFA5', '#C51162', '#FFCDD2', '#1B5E20', '#D500F9', '#F50057', '#827717', '#00E5FF', '#304FFE',
          '#beb0f8', '#f1dcb0']
      }
    }
  },
  watch: {
    'statesStore.num_processes'() {
      if (this.statesStore.num_processes <= 32 && this.statesStore.block_size <= 4) {
        this.statesStore.processes = this.statesStore.generateDataSet()
        if (this.statesStore.algorithm.receive_buffer)
          this.statesStore.receive_buffer = this.statesStore.generateRBuffer()
      }
    },
    'statesStore.block_size'() {
      if (this.statesStore.num_processes <= 32 && this.statesStore.block_size <= 4) {
        this.statesStore.processes = this.statesStore.generateDataSet()
        if (this.statesStore.algorithm.receive_buffer)
          this.statesStore.receive_buffer = this.statesStore.generateRBuffer()
      }
    }
  },
  methods: {
    toggle_graph() {
      this.graph_dialog = !this.graph_dialog
    },
    border_width(status) {
      if (status === 1) {
        return '2px'
      } else if (this.statesStore.step.substep === 1) {
        return '1px'
      } else {
        return '2px'
      }
    },
    getStatusColor(status) {
      switch (status) {
        case 0:
          return "primary--text"
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
  },
  beforeMount() {
    if (this.statesStore.algorithm.scheme)
      this.scheme = this.statesStore.algorithm.scheme[0]

    switch (this.$vuetify.display.name) {
      case 'sm':
        this.statesStore.num_processes = 12
        break
      case 'xs':
        this.statesStore.num_processes = 8
        break
      default:
        this.statesStore.num_processes = 16
        break
    }

    this.statesStore.block_size = 1
    this.statesStore.radix = 2

    this.statesStore.reset()
  },
  mounted() {
    this.$refs.settingsForm.validate()
    this.overlay_main = this.statesStore.welcome
  },
  beforeDestroy() {
    clearInterval(this.statesStore.timer)
  },
  setup() {
    const statesStore = useStatesStore()
    const { smAndDown } = useDisplay()
    
    return {
      statesStore,
      smAndDown,
    }
  }
}
</script>


<style>
.infotext {
  font-size: 18px;
}

.animate {
  animation-name: coloradjust;
  animation-duration: .5s;
  color: rgb(var(--v-theme-primary--text));
}
@keyframes coloradjust {
  from { color: rgb(var(--v-theme-primary)) }
  to { color: rgb(var(--v-theme-primary--text)); }
}

.blink-2 {
  animation-name: opacityadjust;
  animation-duration: .25s;
  opacity: 1;
}
@keyframes opacityadjust {
  from { opacity: 0; }
  to { opacity: 1; }
}

.thick-border {
  border-width: 2px;
}
</style>
