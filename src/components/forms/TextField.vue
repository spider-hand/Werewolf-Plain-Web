<template>
  <div class="input-wrapper">
    <label 
      class="input-label"
      :class="{ 'text-error': hasError }">{{ props.label }}</label>
    <label 
      class="input-label ml-2"
      :class="{ 'text-error': hasError }">{{ props.errorMessage }}</label>
    <input 
      class="input" 
      :class="{ 'input-error': hasError }"
      :type="props.type"
      v-model="state.model"
      @input="onInputChanged">
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, computed, } from '@vue/composition-api'

  export default defineComponent({
    props: {
      label: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      errorMessage: {
        type: String,
        required: true,
      },
      eventName: {
        type: String,
        required: true,
      }
    },

    setup(props, context) {
      const state = reactive<{
        model: string,
      }>({
        model: '',
      })

      const hasError = computed<boolean>(() => {
        return props.errorMessage !== ''
      })

      function onInputChanged(event: Event): void {
        context.emit(props.eventName, state.model)
      }

      return {
        props,
        state,
        hasError,
        onInputChanged,
      }
    }
  })
</script>

<style lang="scss">
  .input-wrapper {
    width: 100%;
    position: relative;
    padding: 0 25px 0 25px;
    margin: 30px 0 30px 0;
  }

  .input-label {
    color: $gray3;
    font-size: 12px;
    font-weight: 500;
  }

  .input {
    font-size: 16px;
    width: 100%;
    height: 45px;
    color: $white;
    background-color: $black4;
    border-radius: 3px;
    border: 1.5px solid $black5;
    padding: 0 10px 0 10px;
  }

  .input:focus {
    outline: none;
  }

  .text-error {
    color: $red1;
  }

  .input-error {
    border: 1.5px solid $red1;
  }

  @media(max-width: 450px) {
    .input-wrapper {
      padding: 0 15px 0 15px;
      margin: 15px 0 20px 0; 
    }   
  }
</style>