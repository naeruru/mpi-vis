<template>
    <v-main>
        <v-container fluid>
            <div class="d-flex justify-center">
                <v-col :sm="12" :md="8" :xl="6">
                    <h1>Select Options</h1>
                </v-col>
            </div>
            <div class="d-flex justify-center">
                <v-col :sm="12" :md="8" :xl="6">
                    <v-card class="pt-6 px-6">
                        <div d-flex flex-row mb-6>
                            <v-row>
                                <v-col>
                                    <v-select v-model="algorithm" :items="algorithms" label="Algorithm"></v-select>
                                </v-col>
                                <v-col>
                                    <v-select v-model="scheme" :items="schemes" label="Scheme"></v-select>
                                </v-col>
                            </v-row>

                            <v-row class="pl-2 pb-4">
                                <div class="text-caption">Number of processes</div>
                            </v-row>
                            <v-row class="pb-8">
                                <v-slider v-model="num_processes" :min="1" :max="10" :step="1" label="num_processes"
                                    hide-details>
                                    <template v-slot:prepend>
                                        <v-text-field v-model="num_processes" type="number" style="width: 80px"
                                            density="compact" hide-details variant="outlined"></v-text-field>
                                    </template>
                                </v-slider>
                            </v-row>

                            <v-row class="pl-2 pb-4">
                                <div class="text-caption">Elements per data-block</div>
                            </v-row>
                            <v-row class="pb-8">
                                <v-slider v-model="block_size" :min="1" :max="10" :step="1" label="num_processes" hide-details>
                                    <template v-slot:prepend>
                                        <v-text-field v-model="block_size" type="number" style="width: 80px"
                                            density="compact" hide-details variant="outlined"></v-text-field>
                                    </template>
                                </v-slider>
                            </v-row>
                        </div>
                        <div class="d-flex justify-end mb-6">
                            <v-btn color="primary" @click="startVis">Run</v-btn>
                        </div>
                    </v-card>
                </v-col>
            </div>
        </v-container>
        <v-footer app>
            <v-card width=100% class="text-end">
                anonymous
            </v-card>
        </v-footer>
    </v-main>
</template>

<script>

export default {
    name: 'Home',

    data: () => ({
        algorithm: 'Bruck',
        algorithms: ['Bruck'],

        scheme: 'Uniform',
        schemes: ['Uniform', 'Non-Uniform'],

        num_processes: 6,

        block_size: 2,
    }),
    methods: {
        startVis () {
            this.$router.push({ name: 'visualize' })
        }
    }
}
</script>
