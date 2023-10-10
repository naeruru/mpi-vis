<template>

</template>
  
<script>
import collectives from "../data/collectives.js";
import page_details from "../data/main_page.js";

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
    computed: {
        title() {
            if (this.$route.name === "visualize") {
                const selectedCollective = collectives[this.$route.params.collective]
                const selectedAlgorithm = selectedCollective.algorithms[this.$route.params.algorithm]
                return `${selectedCollective.name} ー ${selectedAlgorithm.name}`
            } else {
                return page_details.title
            }
        }
    },
    methods: {
        returnToCollective() {
            const selectedCollective = collectives[this.$route.params.collective]
            this.$router.push({ path: `/c/${selectedCollective.id}` })
        }
    }
}
</script>
  