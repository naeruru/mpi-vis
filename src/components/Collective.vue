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
            <v-divider></v-divider>
            <apexchart width="100%" type="area" :options="chartOptions" :series="series"></apexchart>
        </v-card>
    </v-container>
</template>

<script>

export default {
    data: () => ({
        collectives: {
            'alltoall': {
                id: 1,
                name: "All to All",
            },
            'allreduce': {
                id: 1,
                name: "All Reduce",
            },
            'allgather': {
                id: 1,
                name: "All Gather",
            },
        },

        chartOptions: {
            chart: {
                id: "vuechart-example",
                background: "transparent"
            },
            xaxis: {
                categories: [1, 2, 3, 4, 5, 6, 7, 8],
            },
            theme: {
                mode: 'dark'
            }
        },
        series: [
            {
                name: "series-1",
                data: [30, 40, 45, 50, 52, 60, 70, 91],
            },
            {
                name: "series-2",
                data: [30, 32, 35, 45, 49, 60, 90, 110],
            }
        ],
    })
}
</script>