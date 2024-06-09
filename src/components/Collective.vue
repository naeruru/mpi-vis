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
            <v-card-text v-for="algorithm in collectives[$route.params.id].algorithms" :id="algorithm.name" >
                <!-- <v-divider class="mb-6"></v-divider> -->
                <v-row>
                    <v-col :cols="12" :md="12" :lg="12">
                        <v-card-title class="text-h5 text-primary">
                            {{ algorithm.name }}
                        </v-card-title>
                        <v-card-text v-html="algorithm.desc" class="text-subtitle-1">
                        </v-card-text>
                        <v-card-actions class="justify-end pl-4 pt-0">
                            <v-btn variant="elevated" color="primary" @click="$router.push({ path: `/vis/${$route.params.id}/${algorithm.id}` })">visualize</v-btn>
                        </v-card-actions>
                    </v-col>
                </v-row>
                <v-divider class="mt-2"></v-divider>
            </v-card-text>
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

<style scoped>
.text-big {
    font-size: 18px;
}
</style>