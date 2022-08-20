<template>
    <v-container>
        <v-card flat>
            <v-card-title>
                <h2>{{ collectives[$route.params.id].name }}</h2>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam
                rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
                explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
                consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui
                dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora
                incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
                exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem
                vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum
                qui dolorem eum fugiat quo voluptas nulla pariatur?
            </v-card-text>
            <v-card-title>Click on an algorithm to get started</v-card-title>
            <v-divider class="mb-4"></v-divider>
            <apexchart width="100%" :options="chartOptions" :series="collectives[$route.params.id].algorithms" @legendClick="legendClicked"></apexchart>
        </v-card>
    </v-container>
</template>

<script>

import collectives from "../data/collectives.json";

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
                title: { text: 'Communicator size', style: { fontSize: '14px'} }
            },
            yaxis: {
                title: { text: 'Total data size', style: { fontSize: '14px'}  }
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