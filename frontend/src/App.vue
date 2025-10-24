<template>
  <div class="container">
    <header class="topbar">
      <h1>SkinSense</h1>
      <button v-if="token" @click="logout">Logout</button>
    </header>
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue';
const token = computed(() => localStorage.getItem('token'));
const logout = () => { localStorage.removeItem('token'); location.href='/login'; };
</script>

<style>
.container { max-width: 920px; margin: 0 auto; padding: 16px; }
.topbar { display:flex; justify-content:space-between; align-items:center; }
button { cursor:pointer; }
.card { background:#fff; border:1px solid #e9e9e9; border-radius:10px; padding:14px; margin:12px 0; }
.row { display:flex; gap:8px; align-items:center; }
.grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(260px,1fr)); gap:12px; }
input, button { padding:8px 10px; border-radius:6px; }
button { background:#111; color:#fff; border:none; }
</style>
