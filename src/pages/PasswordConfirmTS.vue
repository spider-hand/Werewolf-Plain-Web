<template>
  <div id="page">
    <v-container
      class="password-confirm-form-container"
      fill-height
      fluid>
      <v-row>
        <div class="password-confirm-form-wrapper">
          <form class="password-confirm-form-group">
            <div class="input-wrapper">
              <label class="input-label">NEW PASSWORD</label>
              <input class="password-confirm-input" type="password" name="new-password">
            </div>
            <div class="input-wrapper">
              <label class="input-label">CONFIRM PASSWORD</label>
              <input class="password-confirm-input" type="password" name="confirm-password">
            </div>
            <div class="btn-wrapper">
              <button class="password-confirm-btn">RESET PASSWORD</button>
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

  .password-confirm-form-wrapper {
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

  .password-confirm-input {
    font-size: 16px;
    width: 100%;
    height: 45px;
    color: $white;
    background-color: $black4;
    border-radius: 3px;
    border: 1.5px solid $black5;
    padding: 0 10px 0 10px;
  }

  .password-confirm-input:focus {
    outline: none;
  }

  .password-confirm-btn {
    font-size: 16px;
    width: 100%;
    height: 50px;
    background-color: $red1;
    color: $white;
    border-radius: 3px;
  }

</style>
