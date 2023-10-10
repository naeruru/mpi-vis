

<template>
    <v-dialog v-model="value" max-width="1200" transition="dialog-bottom-transition">
        <v-card class="">
            <v-sheet color="primary">
                <v-card-actions  class="pa-0">
                    <span class="text-h6 ml-4">Blocks transfered for {{ processes }} processes</span>
                    <v-spacer></v-spacer>
                    <v-btn icon="mdi-close" @click="close"></v-btn>
                </v-card-actions>
            </v-sheet>
            <v-card-text class="red-text mt-4">
                <v-row>
                    <v-col :cols=12>
                        As Radix (r) changes, 
                        <span class="text-light-blue font-weight-bold">data-blocks transmitted (D)</span> 
                        and  
                        <span class="text-orange font-weight-bold">communication rounds (K)</span> 
                        will decrease and increase respectively. A discontinuity is 
                        observed for both <span class="text-light-blue font-weight-bold">D</span> 
                        and <span class="text-orange font-weight-bold">K</span>. This inflection point 
                        is observed to happen when <code>r = &Sqrt;P</code>, and can be considered the 
                        "optimal radix."
                    </v-col>
                    <v-col :cols="12">
                        <v-select
                            :modelValue="processes"
                            @update:modelValue="processes = $event"
                            :items="process_options"
                            label="Process count"
                            variant="solo-filled"
                        ></v-select>
                    </v-col>
                </v-row>
            </v-card-text>
            <apexchart id="blocksmoved" class="ma-4" :options="chartOptions" :series="series"></apexchart>
        </v-card>
    </v-dialog>
</template>

<script>

import ApexCharts from 'apexcharts'
import { useTheme } from 'vuetify'

export default {
    props: {
        modelValue: Boolean,
        processes: Number,
    },
    emits: ['update:modelValue'],
    data(){
        return {
            process_options: [],
            graph_loading: false,
            series: [
                {
                    name: 'Data-blocks (D)',
                    data: []
                },
                {
                    name: 'Comm steps (K)',
                    data: []
                }
            ],
            chartOptions: {
                chart: {
                    id: "blocksmoved",
                    type: "line",
                    background: "transparent",
                    toolbar: {
                        show: true,
                        export: {
                            csv: {
                                headerCategory: 'radix (r)',
                            }
                        }
                    }
                },
                title: {
                    text: `Blocks transferred (P = ${this.processes})`,
                    align: 'center',
                    style: { fontSize: '20px'}
                },
                theme: {
                    mode: this.theme.global.name.value,
                    palette: 'palette6'
                },
                legend: {
                    position: 'top',
                    fontSize: '18px'
                },
                xaxis: {
                    title: { text: 'Radix (r)', style: { fontSize: '20px'} },
                    type: 'numeric',
                    labels: {
                        style: { fontSize: '14px'},
                    },
                },
                // yaxis: {
                //     title: { text: 'Communication steps', style: { fontSize: '14px'}  }
                // },
                yaxis: [
                    {
                        title: {
                            text: "D",
                            rotate: 0,
                            style: { fontSize: '20px'}
                        },
                        labels: { style: { fontSize: '14px'} },
                    },
                    {
                        opposite: true,
                        title: {
                            text: "K",
                            rotate: 0,
                            style: { fontSize: '20px'}
                        },
                        labels: { style: { fontSize: '14px'} },
                    }
                ],
                stroke: {
                    curve: 'straight'
                }
            }
        }
    },
    methods: {
        get_kd(processes, radix) {
            // calculate k
            let k, d
            let w = Math.log(processes) / Math.log(radix)
            // fixes: log_3(9) = 2.0000000000000004
            if (Math.floor(w) !== Math.floor(w-.0000001) || Math.floor(w) !== Math.floor(w+.0000001)) w = Math.round(w)
            w = Math.ceil(w)
            
            let rw = radix**w
            if (Math.floor(rw) !== Math.floor(rw-.0000001) || Math.floor(rw) !== Math.floor(rw+.0000001)) rw = Math.round(rw)
            
            if ((processes === rw)) { // (w % 1 === 0) fixes rounding issues
                // k = w(r-1)
                k = w * (radix - 1)
                d = k * (radix**(w - 1)) * processes
            } else {
                // k = w(r - 1) - floor((r**(w) - P) / (r**(w-1)))
                k = w * (radix - 1) - Math.floor((rw - processes) / (radix**(w-1)))
                
                // calculate d
                d = 0
                for (let x = 0; x < w; x++) {
                    for (let z = 1; z < radix; z++) {
                        const lgc = processes % radix**(x+1)
                        const t = lgc - (z * radix**x)
                        const lc = Math.floor(processes / radix**(x+1)) * radix**x
                        if (t <= 0) {
                            d += lc
                        } else if (Math.floor(t / radix**x) > 0) {
                            d += lc + radix**x
                        } else {
                            d += lc + t % radix**x
                        }
                    }
                }
                d *= processes
            }
            return {
                k,
                d
            }
        },
        build_graph(processes) {
            this.graph_loading = true
            this.series[0].data = []
            this.series[1].data = []

            for (let radix = 2; radix < processes; radix++) {
                const kd = this.get_kd(processes, radix)
                // console.log(k)
                this.series[0].data.push([radix, kd.d])
                this.series[1].data.push([radix, kd.k])
            }
            this.graph_loading = false
            ApexCharts.exec('blocksmoved', 'updateOptions', {
                title: {
                    text: `Blocks transferred (P = ${this.processes})`
                }
            }, false, true);
        },
        close() {
            this.series[0].data = []
            this.series[1].data = []
            this.$emit('update:modelValue', false)
        },
    },
    watch: {
        modelValue(v) { 
            if (v) {
                this.process_options = [ this.processes, 256, 512, 1024, 2048, 4096 ]
                this.build_graph(this.processes)
            }
        },
        processes(v) {
            this.build_graph(v)
        },
        'theme.global.name.value'(v) {
            this.chartOptions.theme.mode = this.theme.global.name.value
        }
    },
    computed: {
        value: {
            get() {
                return this.modelValue
            },
            set(modelValue) {
                this.$emit('update:modelValue', modelValue)
            }
        }
    },
    setup() {
    const theme = useTheme()

    return {
      theme
    }
  }
}
</script>