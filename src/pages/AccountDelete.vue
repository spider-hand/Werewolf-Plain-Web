<template>
  <div class="page">
    <v-container 
      class="form-container"
      fill-height
      fluid>
      <v-row>
        <div class="form-wrapper">
          <form 
            class="form-group"
            @submit.prevent="validate">
            <TextField
              :label="'EMAIL'" 
              :type="'email'"
              :errorMessage="state.emailErrorMessage"
              :eventName="'onEmailChanged'"
              @onEmailChanged="onEmailChanged" />
            <TextField
              :label="'PASSWORD'" 
              :type="'password'"
              :errorMessage="state.passwordErrorMessage"
              :eventName="'onPasswordChanged'"
              @onPasswordChanged="onPasswordChanged" />
            <FormButton :text="'DELETE ACCOUNT'" />
          </form>
        </div>
      </v-row>
    </v-container>    
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, computed, } from '@vue/composition-api'

  import firebase from 'firebase/app'
  import 'firebase/auth'
  import 'firebase/firestore'
  import 'firebase/storage'
  import { User as FirebaseUser } from 'firebase'

  import { userCollection } from '@/firebase'
  import TextField from '@/components/forms/TextField.vue'
  import FormButton from '@/components/forms/FormButton.vue'

  export default defineComponent({

    components: {
      TextField,
      FormButton,
    },

    setup(props, context) {
      const router = context.root.$router
      const store = context.root.$store

      const required = "This field is required."
      const emailDoesNotMatch = "Email does not match."
      const passwordDoesNotMatch = "Password does not match."

      const state = reactive<{
        email: string,
        password: string,
        emailErrorMessage: string,
        passwordErrorMessage: string,
      }>({
        email: '',
        password: '',
        emailErrorMessage: '',
        passwordErrorMessage: '',
      })

      const user = computed<FirebaseUser | null>(() => {
        return store.getters.user
      })

      function onPasswordChanged(val: string): void {
        state.password = val
      }

      function onEmailChanged(val: string): void {
        state.email = val
      }

      function validate(): void {
        if (state.email === '' || state.password === '') {
          if (state.email === '') {
            state.emailErrorMessage = required
          }
          if (state.password === '') {
            state.passwordErrorMessage = required
          }
        } else {
          deleteAccount()
        }
      }

      function deleteAccount(): void {
        const credentials = firebase.auth.EmailAuthProvider.credential(state.email, state.password)

        if (user.value) {
          user!.value!.reauthenticateWithCredential(credentials)
            .then((credential) => {
              // Delete the account if the email and the password are correct
              const docRef = userCollection.doc(credential!.user!.uid)

              docRef.delete().then(() => {
                // Delete an avatar associated with the user
                const storage = firebase.storage()
                const storageRef = storage.ref('avatars/' + user!.value!.uid)

                // Log the error when the image doesn't exist and move on
                storageRef.delete().catch((err) => console.log(err))

                user!.value!.delete().then(() => {
                  router.push({
                    name: 'room-list',
                    params: {
                      snackbarText: 'Your account has been deleted.',
                    }
                  })
                })
                .catch((err) => {
                  console.log(err)
                })
              })
              .catch((err) => {
                console.log(err)
              })
            })
            .catch((err) => {
              state.emailErrorMessage = emailDoesNotMatch
              state.passwordErrorMessage = passwordDoesNotMatch
            })
        }
      }

      return {
        state,
        onPasswordChanged,
        onEmailChanged,
        validate,
      }
    }
  })
</script>

<style lang="scss" scoped>
  .form-wrapper {
    width: 500px;
    border-radius: 3px;
    background-color: $black3;
    margin: auto;
  }

  @media(max-width: 450px) {
    .form-wrapper {
      width: 100%;
      margin: 0 10px 0 10px;
    }
  }
</style>