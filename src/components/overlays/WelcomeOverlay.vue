<template>
    <v-overlay
        v-model="overlay_state"
        transition="slide-x-transition"
        :class="overlay_page === 0 ? 'align-center justify-center' : 'align-center justify-center'"
    >
        <v-card v-if="overlay_page == 0" title="Welcome to MPI Visualizer!" class="pa-2" max-width="500">
            <template v-slot:prepend>
                <v-avatar color="primary"></v-avatar>
            </template>
            <v-card-text class="text-subtitle-1 py-2 mb-4">
                This page lets you visualize a specific algorithm from MPI and view detailed information on its steps and other useful information.
                Since this is you first time, refer below for buttons and what they do.
            </v-card-text>
            <v-card-text v-for="control in controls" class="text-subtitle-1 py-2">
                <v-icon class="me-2" :color="control.color">{{ control.icon }}</v-icon>
                <span>{{ control.desc }}</span>
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn color="info" @click="overlay_state = false">
                    Close
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-overlay>
</template>


<script lang="ts">
import { useStatesStore } from  '../../stores/states'

export default {
    name: 'WelcomeOverlay',
    props: {
        overlay: Boolean,
        page: Number
    },
    data() {
        return {
            overlay_state: this.overlay,
            overlay_page: this.page,
            controls: [
                {
                    icon: 'mdi-help',
                    color: '',
                    desc: 'Open information panel',
                },
                {
                    icon: 'mdi-chevron-left',
                    color: 'success',
                    desc: 'Previous step',
                },
                {
                    icon: 'mdi-chevron-right',
                    color: 'success',
                    desc: 'Next step',
                },
                {
                    icon: 'mdi-play',
                    color: 'info',
                    desc: 'Play animation',
                },
                {
                    icon: 'mdi-pause',
                    color: 'error',
                    desc: 'Pause animation',
                },
                {
                    icon: 'mdi-stop',
                    color: 'error',
                    desc: 'Reset animation',
                },
            ]
        }
    },
    watch: {
        overlay(new_val) {
            this.overlay_state = new_val
        },
        overlay_state(new_val) {
            this.statesStore.welcome = false
        }
    },
    setup() {
        const statesStore = useStatesStore()

        return {
            statesStore
        }
    }
}
</script>