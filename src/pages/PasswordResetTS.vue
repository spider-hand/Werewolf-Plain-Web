<template>
  <div id="page">
    <v-container
      class="password-reset-form-container"
      fill-height
      fluid>
      <v-row>
        <div class="password-reset-form-wrapper">
          <form class="password-reset-form-group">
            <div class="input-wrapper">
              <label class="input-label">EMAIL or USERNAME</label>
              <input class="password-reset-input" type="text" name="username">
            </div>
            <div class="btn-wrapper">
              <button class="password-reset-btn">SEND RESET LINK</button>
            </div>
          </form>
        </div>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
  
</script>

<style lang="scss" scoped>
  #page {
    position: relative;
    height: 100%;
    background-color: $black1;
  }

  .password-reset-form-wrapper {
    width: 500px;
    border-radius: 3px;
    background-color: $black3;
    margin: auto;
  }
  .form-title {
    font-size: 20px;
    font-weight: 700;
    color: $white;
  }

  .input-wrapper, .btn-wrapper {
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

  .password-reset-input {
    font-size: 16px;
    width: 100%;
    height: 45px;
    color: $white;
    background-color: $black4;
    border-radius: 3px;
    border: 1.5px solid $black5;
    padding: 0 10px 0 10px;
  }

  .password-reset-input:focus {
    outline: none;
  }

  .password-reset-btn {
    font-size: 16px;
    width: 100%;
    height: 50px;
    background-color: $red1;
    color: $white;
    border-radius: 3px;
  }

</style>
