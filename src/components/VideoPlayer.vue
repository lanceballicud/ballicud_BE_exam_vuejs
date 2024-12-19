
<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
})

const videoPlayer = ref(null)
let player = null

const initializePlayer = () => {
  if (player) {
    player.dispose()
  }
  player = videojs(videoPlayer.value, {
    controls: true,
    autoplay: true,
    preload: 'auto',
    fluid: true,
  })
  if (props.url) {
    player.src({ src: props.url, type: 'video/mp4' })
  } else {
    console.error('URL is undefined!')
  }
}

watch(
  () => props.url,
  (newUrl) => {
    if (player && newUrl) {
      player.src({ src: newUrl, type: 'video/mp4' })
    }
  }
)

onMounted(() => {
  initializePlayer()
})

onBeforeUnmount(() => {
  if (player) player.dispose()
})

</script>

<template>
    <div class="max-w-4xl mx-auto">
    <video
      ref="videoPlayer"
      class="video-js w-full"
      controls
      preload="auto"
    ></video>
  </div>
  </template>