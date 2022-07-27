<template>
    <v-container>
        <v-row>
            <v-col :sm="12" :md="2" :xl="2">
                <v-card rounded="lg">
                    <v-list>
                        <v-list-subheader>COLLECTIVES</v-list-subheader>
                        <v-list-item v-for="(collective, i) in collectives" :key="i" :value="collective"
                            active-color="primary" rounded="xl"
                            @click="$router.push({ path: `/c/${collective.redirect}` })">
                            <v-list-item-title v-text="collective.title"></v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>

            <v-col v-if="$route.params.id">
                <v-card min-height="70vh" rounded="lg">
                    <router-view name="Collective"></router-view>
                </v-card>
            </v-col>
            <v-col v-else>
                <v-card class="mb-6" rounded="lg">
                    <v-card-title>MPI Visualizer</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                        laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
                        beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                        odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                        Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit,
                        sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat
                        voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit
                        laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui
                        in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat
                        quo voluptas nulla pariatur?
                    </v-card-text>
                </v-card>
                <v-card>
                    <v-card-title>Related Publications</v-card-title>
                    <v-divider></v-divider>
                    <v-table>
                        <thead>
                            <tr>
                                <th class="text-left">
                                    Title
                                </th>
                                <th class="text-left">
                                    Author
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in publications" :key="item.name" class="clickable" v-on:click="openLink(item.link)">
                                <td>{{ item.title }}</td>
                                <td>{{ item.author }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data: () => ({
        collectives: [
            // { type: 'subheader', title: 'Collectives' },
            { title: 'All to all', id: 1, redirect: 'alltoall' },
            { title: 'All reduce', id: 2, redirect: 'allreduce' },
            { title: 'All gather', id: 3, redirect: 'allgather' },
            { title: '...', id: 4, },
        ],
        publications: [
            {
                title: 'publication 1',
                author: 'Jane',
                link: ''
            },
            {
                title: 'publication 2',
                author: 'Jane',
                link: ''
            },
            {
                title: 'publication 3',
                author: 'Jane',
                link: ''
            },
            {
                title: 'publication 4',
                author: 'Jane',
                link: ''
            },
        ]
    }),
    methods: {
        openLink(link) {
            window.open(link, '_blank')
        }
    }
}
</script>

<style>
.clickable {
  cursor: pointer;
}
</style>