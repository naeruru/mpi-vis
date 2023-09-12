import { defineStore } from 'pinia'
import { reactive } from 'vue'

import collectives from "../data/collectives.js"
import algorithms from "../helpers/algorithms.js"

export const useStatesStore = defineStore('states', {
  state: () => ({

    drawer: true,
    rail: true,

    timer: null,
    timerInterval: 0,

    started: false, // has vis started
    running: false, // is vis auto running
    done: false, // is vis done

    k: 0,
    step: null,

    data_moved: 0,
    data_pending: 0,

    processes: null,

    num_processes: 16,
    block_size: 1,
  }),
  getters: {
    algorithm() {
      const collective = this.router.currentRoute.params.collective
      const algorithm = this.router.currentRoute.params.algorithm
      return collectives[collective].algorithms[algorithm]
    }
  },
  actions: {
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
      this.data_moved = 0
      this.data_pending = 0
      clearInterval(this.timer)
      this.step = {
        id: 0,
        substep: 0,
        text: "Initial State",
        subtext: this.algorithm.info.initial
      }
      this.processes = this.generateDataSet()
    },
    async runStep(undo = false) {
      this.started = true
      const collective = this.router.currentRoute.params.collective
      const algorithm = this.router.currentRoute.params.algorithm
      await algorithms[collective][algorithm](this.processes, this.k, this.step, this.num_processes, this.block_size, this.data_moved, undo).then(data => {
        if (!data) return
        this.k = data.k
        this.step = data.step
        this.data_moved = data.data_moved
        this.data_pending = data.data_pending
        if (!this.data_moved && !this.data_pending) this.started = false // undo all the way
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
  }
})