<template>
  <div class="card">
    <h2>Register</h2>
    <form @submit.prevent="submit">
      <input v-model="name" placeholder="Name" />
      <input v-model="email" placeholder="Email" type="email" required />
      <input v-model="password" placeholder="Password" type="password" required />
      <button :disabled="loading">Create account</button>
      <p v-if="error" style="color:red">{{ error }}</p>
    </form>
    <p>Уже есть аккаунт? <a href="/login">Login</a></p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../api';

const name = ref('Konst');
const email = ref('k@k.com');
const password = ref('pass123');
const loading = ref(false);
const error = ref('');

const submit = async () => {
  loading.value = true; error.value='';
  try {
    const { data } = await api.post('/auth/register', { name: name.value, email: email.value, password: password.value });
    localStorage.setItem('token', data.token);
    location.href = '/dashboard';
  } catch (e) {
    const m = e?.response?.data?.error || e?.message || 'Register failed';
    error.value = msg;
  } finally { loading.value=false; }
};
</script>
