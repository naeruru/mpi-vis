<template>
    <v-footer app class="d-flex flex-column">
        <div class="pb-3 text-center w-100 d-md-none">
            <v-menu :close-on-content-click="false" location="top">
                <template v-slot:activator="{ props }">
                    <v-btn block variant="outlined" v-bind="props">
                        {{ title }}
                    </v-btn>
                </template>

                <v-card max-width="500">
                    <v-card-item>
                        <v-card-title>{{ title }}</v-card-title>
                        <v-card-subtitle>
                            <p v-if="data_pending === 0">{{ data_moved }} total blocks moved</p>
                            <p v-else>{{ data_moved }} total blocks moved ({{ data_pending }} sending)</p>
                        </v-card-subtitle>
                    </v-card-item>
                    <v-divider class="mx-4"></v-divider>
                    <v-card-text class="text-subtitle-1" v-html="description"></v-card-text>
                </v-card>

            </v-menu>
        </div>
        <div class="d-flex w-100 align-center">
            <v-menu :close-on-content-click="false" location="top">
                <template v-slot:activator="{ props }">
                    <v-btn class="d-none d-md-flex" icon size="x-small" variant="outlined" v-bind="props">
                        <v-icon>mdi-help</v-icon>
                    </v-btn>
                </template>

                <v-card max-width="500">
                    <v-card-item>
                        <v-card-title>{{ title }}</v-card-title>
                        <v-card-subtitle>
                            <p v-if="data_pending === 0">{{ data_moved }} total blocks moved</p>
                            <p v-else>{{ data_moved }} total blocks moved ({{ data_pending }} blocks sending)</p>
                        </v-card-subtitle>
                    </v-card-item>
                    <v-divider class="mx-4"></v-divider>
                    <v-card-text class="text-subtitle-1" v-html="description"></v-card-text>
                </v-card>

            </v-menu>

            <h3 class="mx-2 d-none d-md-flex">{{ title }}</h3>

            <v-chip class="mr-1 d-none d-md-flex" color="primary">{{ data_moved }} total blocks transfered</v-chip>
            <v-chip class="d-none d-md-flex">
                <v-progress-circular v-if="description === 1" class="mr-1" indeterminate :size="21"
                    :width="1"></v-progress-circular>
                <v-icon v-if="description === 2" class="mr-1">mdi-check</v-icon>
                {{ data_pending }} blocks transferring this step
            </v-chip>

            <v-spacer></v-spacer>

            <div class="d-flex justify-center align-baseline">
                <v-btn :disabled="$parent.running || $parent.done || !$parent.valid_options" :loading="$parent.running" class="mr-3" color="info"
                    @click="play">
                    play
                </v-btn>
                <v-btn :disabled="$parent.done || !$parent.valid_options" class="mr-3" color="success" @click="runStep">
                    step
                </v-btn>
                <v-btn :disabled="!$parent.running || !$parent.started" class="mr-3" color="error" @click="stop">
                    stop
                </v-btn>
                <v-btn :disabled="!$parent.started" color="error" @click="reset">
                    reset
                </v-btn>
            </div>
        </div>
    </v-footer>
</template>


<script>

export default {
    name: 'Header',
    props: {
        title: String,
        data_pending: Number,
        data_moved: Number,
        description: String,
    },
    data: () => ({
        //
    }),
    methods: {
        play() {
            this.$parent.play()
        },
        stop() {
            this.$parent.stop()
        },
        reset() {
            this.$parent.reset()
        },
        runStep() {
            this.$parent.runStep()
        },
    }
}
</script>