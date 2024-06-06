<template>
    <v-container>
        <v-row>
            <v-col :cols="12" :xs="12" :lg="2">
                <v-card rounded="lg">
                    <v-list>
                        <v-list-subheader class="font-weight-black">MENU</v-list-subheader>
                        <v-list-item
                            key="home" value="home"
                            :active="($route.name === 'home')"
                            color="primary"
                            @click="$router.push({ path: '/' })"
                        >
                            <v-list-item-title>Home</v-list-item-title>
                        </v-list-item>
                        <!-- <v-divider></v-divider> -->
                        <v-list-subheader>COLLECTIVES</v-list-subheader>
                        <v-list-group v-for="(collective, i) in collectives" :value="collective">
                            <template v-slot:activator="{ props }">
                                <v-list-item
                                    v-for="(collective, i) in collectives" 
                                    :key="i"
                                    v-bind="props"
                                    :active="(collective.id === $route.params.id)"
                                    color="primary"
                                    @click="$router.push({ path: `/c/${collective.id}` })"
                                >
                                    <v-list-item-title v-text="collective.name"></v-list-item-title>
                                </v-list-item>
                            </template>
                            <v-list-item
                                v-for="(algorithm, j) in collective.algorithms"
                                :key="j"
                                @click="$router.push({ path: `/vis/${collective.id}/${algorithm.id}` })"
                            >
                                <v-list-item-title v-text="algorithm.name"></v-list-item-title>
                            </v-list-item>
                        </v-list-group>
                        
                    </v-list>
                </v-card>
            </v-col>

            <v-slide-y-transition leave-absolute>
                <v-col v-if="$route.params.id" :cols="12" :xs="12" :lg="10" :xl="8">
                    <v-card rounded="lg">
                        <router-view name="Collective"></router-view>
                    </v-card>
                </v-col>
                <v-col v-else :cols="12" :xs="12" :md="9" :lg="10" :xl="8">
                    <v-card class="mb-6" rounded="lg">
                        <v-card-title>{{ page_details.title }}</v-card-title>
                        <v-divider class="mx-4"></v-divider>
                        <v-card-text class="text-subtitle-1 px-6" v-html="page_details.body"></v-card-text>
                    </v-card>
                    <v-card rounded="lg">
                        <v-card-title>Related Publications</v-card-title>
                        <v-divider></v-divider>
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="text-left">
                                        Title
                                    </th>
                                    <th class="text-left">
                                        Author(s)
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in page_details.publications" :key="item.name" class="clickable" v-on:click="openLink(item.link)">
                                    <td class="text-primary"><strong>{{ item.title }}</strong></td>
                                    <td>{{ item.author }}</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card>
                </v-col>
            </v-slide-y-transition>
        </v-row>
    </v-container>
</template>

<script>

import collectives from "../data/collectives.js"
import page_details from "../data/main_page.js"

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