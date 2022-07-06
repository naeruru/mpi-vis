<template>
    <v-main>
        <v-container fluid>
            <div class="d-flex justify-center mb-6">
                <v-col cols="6" class="bg-surface-variant">
                    <v-row no-gutters>
                        <h2>Select Options</h2>
                    </v-row>
                    <v-row no-gutters style="height: 150px;">
                        <v-col align-self="start">
                            <v-sheet class="pa-2 ma-2">
                                .align-self-start
                            </v-sheet>
                        </v-col>

                        <v-col align-self="center">
                            <v-sheet class="pa-2 ma-2">
                                .align-self-center
                            </v-sheet>
                        </v-col>

                        <v-col align-self="end">
                            <v-sheet class="pa-2 ma-2">
                                .align-self-end
                            </v-sheet>
                        </v-col>
                    </v-row>
                </v-col>
            </div>
        </v-container>
    </v-main>
</template>

<script>

export default {
    name: 'Home',

    data: () => ({
        //
    }),
}
</script>
