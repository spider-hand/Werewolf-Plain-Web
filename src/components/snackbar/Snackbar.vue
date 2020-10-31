<template>
  <v-snackbar
    class="snackbar"
    color="#2F3136"
    :timeout="6000"
    :value="props.text"
    absolute
    bottom
    centered>
    {{ props.text }}
  </v-snackbar>
</template>

<script lang="ts">
  import { defineComponent, } from '@vue/composition-api'

  export default defineComponent({
    props: {
      text: {
        type: String,
        required: false,
      }
    },

    setup(props, context) {
      return {
        props,
      }
    }
  })
</script>

<style lang="scss" scoped>
  
</style>