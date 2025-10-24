<template>
  <div>
    <h2>Dashboard</h2>

    <section class="card">
      <h3>Профиль</h3>
      <p v-if="me">👤 {{ me.name }} — {{ me.email }}</p>
    </section>

    <CameraCapture />

    <section class="card">
      <div class="row" style="justify-content:space-between;">
        <h3>Мои сканы</h3>
        <button @click="loadScans">Обновить</button>
      </div>
      <div class="grid">
        <div class="card" v-for="s in scans" :key="s.id">
          <img :src="apiBase + '/' + s.imagePath" alt="" style="width:100%; border-radius:6px;" />
          <p>ID: {{ s.id }} · {{ new Date(s.createdAt).toLocaleString() }}</p>
          <p v-if="s.summary">🧠 {{ s.summary }}</p>
          <div v-else class="row">
            <button @click="analyze(s.id)" :disabled="busyId===s.id">Анализ</button>
            <button @click="remove(s.id)" :disabled="busyId===s.id">Удалить</button>
          </div>
          <div v-if="hasScores(s)">
            <ul>
              <li>Acne: {{ s.scoreAcne ?? '-' }}</li>
              <li>Wrinkles: {{ s.scoreWrinkles ?? '-' }}</li>
              <li>Redness: {{ s.scoreRedness ?? '-' }}</li>
              <li>Dark spots: {{ s.scoreDarkSpots ?? '-' }}</li>
              <li>Pores: {{ s.scorePores ?? '-' }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';
import CameraCapture from '../components/CameraCapture.vue';

const apiBase = import.meta.env.VITE_API_BASE;
const me = ref(null);
const scans = ref([]);
const busyId = ref(null);

async function loadMe() { const { data } = await api.get('/user/me'); me.value = data; }
async function loadScans() { const { data } = await api.get('/scans'); scans.value = data; }

function hasScores(s) {
  return [s.scoreAcne,s.scoreWrinkles,s.scoreRedness,s.scoreDarkSpots,s.scorePores].some(v => v !== null && v !== undefined);
}

async function analyze(id) { busyId.value = id; await api.post(`/scans/${id}/analyze`); await loadScans(); busyId.value=null; }
async function remove(id) { busyId.value = id; await api.delete(`/scans/${id}`); await loadScans(); busyId.value=null; }

onMounted(() => { loadMe(); loadScans(); window.addEventListener('scan:created', loadScans); });
</script>
