<template>
  <div class="btn-wrapper">
    <button class="form-btn">{{ props.text }}</button>
  </div>
</template>

<script lang="ts">
  import { defineComponent, } from '@vue/composition-api'

  export default defineComponent({
    props: {
      text: {
        type: String,
        required: true,
      },
    },

    setup(props, context) {
      return {
        props,
      }
    }
  })
</script>

<style lang="scss">
  .btn-wrapper {
    width: 100%;
    position: relative;
    padding: 0 25px 0 25px;
    margin: 30px 0 30px 0;
  }

  .form-btn {
    font-size: 16px;
    width: 100%;
    height: 50px;
    background-color: $red1;
    color: $white;
    border-radius: 3px;
  }

  @media(max-width: 450px) {
    .btn-wrapper {
      padding: 0 15px 0 15px;
      margin: 15px 0 20px 0;
    }
  }
</style>