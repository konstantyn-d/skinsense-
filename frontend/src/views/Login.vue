<template>
  <div class="card">
    <h2>Login</h2>
    <form @submit.prevent="submit">
      <input v-model="email" placeholder="Email" type="email" required />
      <input v-model="password" placeholder="Password" type="password" required />
      <button :disabled="loading">Sign in</button>
      <p v-if="error" style="color:red">{{ error }}</p>
    </form>
    <p>Нет аккаунта? <a href="/register">Register</a></p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../api';

const email = ref('k@k.com');
const password = ref('pass123');
const loading = ref(false);
const error = ref('');

const submit = async () => {
  loading.value = true; error.value='';
  try {
    const { data } = await api.post('/auth/login', { email: email.value, password: password.value });
    localStorage.setItem('token', data.token);
    location.href = '/dashboard';
  } catch (e) {
    const m = e?.response?.data?.error || e?.message || 'Login failed';
    error.value = msg;
  } finally { loading.value=false; }
};
</script>
