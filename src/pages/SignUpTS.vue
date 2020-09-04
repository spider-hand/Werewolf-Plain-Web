<template>
  <div id="page">
  	<v-container 
  		class="sign-up-form-container"
  		fill-height
  		fluid>
  		<v-row>
	  		<div class="sign-up-form-wrapper">
	  			<form class="sign-up-form-group">
	  				<div class="input-wrapper">
	  					<label class="input-label">EMAIL</label>
	  					<input class="sign-up-input" type="email" name="email">
	  				</div>
	  				<div class="input-wrapper">
	  					<label class="input-label">USERNAME</label>
	  					<input class="sign-up-input" type="text" name="username">
	  				</div>
	  				<div class="input-wrapper">
	  					<label class="input-label">PASSWORD</label>
	  					<input class="sign-up-input" type="password" name="password">
	  				</div>
	  				<div class="btn-wrapper">
	  					<button class="sign-up-btn">SIGN UP</button>
	  				</div>
	  			</form>
	  		</div>
  			<v-col cols="12">
  				<div 
  					class="link-wrapper"
  					align="center"
  					justify="center">
  					<span>Already have an account? </span>
  					<router-link
  						class="sign-in-link"
  						to="/sign-in">
  						Sign in
  					</router-link>
  				</div>
  			</v-col>
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
    background-color: $black1 !important;
  }

  .sign-up-form-wrapper {
  	width: 500px;
  	border-radius: 3px;
  	background-color: $black3 !important;
  	margin: auto;
  }

  .form-title {
  	font-size: 20px;
  	font-weight: 700;
  	color: $white !important;
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

  .sign-up-input {
  	font-size: 16px;
  	width: 100%;
  	height: 45px;
  	color: $white !important;
  	background-color: $black4 !important;
  	border-radius: 3px;
  	border: 1.5px solid $black5;
  	padding: 0 10px 0 10px;
  }

  .sign-up-input:focus {
  	outline: none;
  }

  .sign-up-btn {
  	font-size: 16px;
  	width: 100%;
  	height: 50px;
  	background-color: $red1 !important;
  	color: $white !important;
  	border-radius: 3px;
  }

  .sign-in-link {
  	font-size: 14px;
  	font-weight: 500;
  	color: $white !important;
  	text-decoration: none !important;
  }

  .link-wrapper {
  	margin: 0 0 5px 30px;
  }

 .link-wrapper span {
  	font-size: 14px;
  	color: $gray1 !important;
  }
</style>