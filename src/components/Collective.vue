<template>
    <v-container>
        <v-card flat>
            <v-card-title>
                <h2>{{ collectives[$route.params.id].name }}</h2>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="text-subtitle-1"  v-html="collectives[$route.params.id].body"></v-card-text>
            <v-card-title class="text-wrap">Click on an algorithm below to get started</v-card-title>
            <v-divider></v-divider>
            <v-expansion-panels variant="inset">
                <v-expansion-panel v-for="algorithm in collectives[$route.params.id].algorithms">
                    <v-expansion-panel-title>
                        <template v-slot:default="{ expanded }">
                            <span class="text-subtitle-1" :class="{'text-primary': expanded}">{{ algorithm.name }}</span>
                        </template>
                        <template v-slot:actions="{ expanded }">
                            <v-icon v-if="!expanded" icon="mdi-chevron-down"></v-icon>
                            <v-btn v-else color="primary" @click="$router.push({ path: `/vis/${$route.params.id}/${algorithm.id}` })">visualize</v-btn>
                        </template>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                        {{ algorithm.desc }}
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
            <!-- <apexchart width="100%" :options="chartOptions" :series="collectives[$route.params.id].algorithms" @legendClick="legendClicked"></apexchart> -->
        </v-card>
    </v-container>
</template>

<script>

import collectives from "../data/collectives.js";

export default {
    data: () => ({
        "collectives": collectives,

        chartOptions: {
            chart: {
                id: "collective",
                type: "area",
                background: "transparent",
                toolbar: {
                    show: false
                }
            },
            theme: {
                mode: 'dark',
                palette: 'palette10'
            },
            legend: {
                position: 'top',
                fontSize: '18px'
            },
            xaxis: {
                title: { text: 'Total process count', style: { fontSize: '14px'} }
            },
            yaxis: {
                title: { text: 'Communication steps', style: { fontSize: '14px'}  }
            },
            stroke: {
                curve: 'straight'
            }
        }
    }),
    methods: {
         legendClicked (event, chartContext, config) {
            
            const selectedCollective = collectives[this.$route.params.id]
            const selectedAlgorithm = selectedCollective.algorithms[chartContext]
            this.$router.push({ path: `/vis/${selectedCollective.id}/${chartContext}` })
        }
    }
}
</script>