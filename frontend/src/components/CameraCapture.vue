<template>
  <div class="card">
    <h3>Камера</h3>
    <video ref="video" autoplay playsinline style="width:100%; border-radius:8px;"></video>
    <div class="row" style="margin-top:8px;">
      <button @click="capture" :disabled="busy">Сделать снимок</button>
      <input type="file" accept="image/*" @change="onFile" />
    </div>
    <p v-if="msg">{{ msg }}</p>
    <canvas ref="canvas" style="display:none;"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '../api';

const video = ref(null);
const canvas = ref(null);
const busy = ref(false);
const msg = ref('');

onMounted(async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.value.srcObject = stream;
});

const capture = async () => {
  busy.value = true; msg.value='';
  const v = video.value, c = canvas.value;
  c.width = v.videoWidth; c.height = v.videoHeight;
  c.getContext('2d').drawImage(v, 0, 0, c.width, c.height);
  c.toBlob(async (blob) => {
    const fd = new FormData();
    fd.append('image', blob, `capture_${Date.now()}.png`);
    await upload(fd);
  }, 'image/png');
};

const onFile = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const fd = new FormData();
  fd.append('image', file);
  await upload(fd);
};

async function upload(formData) {
  try {
    const { data } = await api.post('/scans/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
    msg.value = `Загружено. Scan ID: ${data.scan.id}`;
    window.dispatchEvent(new CustomEvent('scan:created'));
  } catch (e) {
    msg.value = e?.response?.data?.error || 'Upload failed';
  } finally { busy.value=false; }
}
</script>
