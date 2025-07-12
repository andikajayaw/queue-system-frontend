<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  alias: "/sign-in",
  layout: false,
});

// State untuk input login
const username = ref('')
const password = ref('')
const router = useRouter()

// Fungsi login
const handleLogin = async () => {
  // Contoh login statis (ganti dengan API login kamu)
  try {
    console.log(username.value, password.value)
    await useLogin(username.value, password.value)
    router.push('/')
  } catch (err: any) {
    alert(err.message)
  }
}

</script>

<template>
  <div class="flex h-screen w-full items-center justify-center px-4">
    <Card class="w-full mx-auto max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl">Queue System - Login</CardTitle>
        <CardDescription>
          Enter your username below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="username">Username</Label>
            <Input id="username" v-model="username" type="text" required />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password">Password</Label>
              <!-- <NuxtLink to="#" class="ml-auto inline-block text-sm underline">
                Forgot your password?
              </NuxtLink> -->
            </div>
            <Input id="password" v-model="password" type="password" required />
          </div>
          <Button type="submit" class="w-full" @click="handleLogin"> Login </Button>
          <!-- <Button variant="outline" class="w-full"> Login with Google </Button> -->
        </div>
        <!-- <div class="mt-4 text-center text-sm">
          Don't have an account?
          <NuxtLink to="#" class="underline"> Sign up </NuxtLink>
        </div> -->
      </CardContent>
    </Card>
  </div>
</template>
