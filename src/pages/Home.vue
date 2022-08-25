<template>
    <v-container>
        <v-row>
            <v-col :xs="12" :sm="12" :md="2" :lg="2" :xl="2">
                <v-card rounded="lg">
                    <v-list>
                        <v-list-subheader>COLLECTIVES</v-list-subheader>
                        <v-list-item
                            v-for="(collective, i) in collectives" 
                            :key="i" :value="collective"
                            :active="(collective.id === $route.params.id)"
                            active-color="primary"
                            @click="$router.push({ path: `/c/${collective.id}` })"
                        >
                            <v-list-item-title v-text="collective.name"></v-list-item-title>
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
                    <v-card-title>{{ page_details.title }}</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        {{ page_details.body }}
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
                            <tr v-for="item in page_details.publications" :key="item.name" class="clickable" v-on:click="openLink(item.link)">
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

import collectives from "../data/collectives.js";
import page_details from "../data/main_page.js";

export default {
    data: () => ({
        collectives: collectives,
        page_details: page_details,
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