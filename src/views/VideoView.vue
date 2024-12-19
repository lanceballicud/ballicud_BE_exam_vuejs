<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import VideoPlayer from '../components/VideoPlayer.vue'
import Button from 'primevue/button'

const loading = ref(false)

const router = useRouter()

const videos = ref([])
const currentVideoUrl = ref(null)

const fetchVideos = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/videos')
    videos.value = response.data

    if (videos.value.length > 0 && !currentVideoUrl.value) {
      currentVideoUrl.value = `http://localhost:8000/videos/${videos.value[0]}` // Set the first video as default
    }

  } catch (error) {
    console.error('Error fetching videos:', error)
  } finally {
    loading.value = false

  }
}

const setVideo = (videoFileName) => {
  loading.value = true
  router.push({ query: { video: videoFileName } })
  currentVideoUrl.value = `http://localhost:8000/videos/${videoFileName}`
  loading.value = false
}

onMounted(fetchVideos)

</script>

<template>

    <div class="w-full h-16 flex flex-row justify-between border-b-2 border-gray-200">
        <div class="h-full w-96 flex justify-center items-center">
            <label class="text-xl font-bold">Video Player</label>
        </div>
        <div class="w-48 h-full flex items-center justify-center">
            <RouterLink :to="{name: 'dashboard'}" class="text-gray-600 border-l-2 border-gray-600 w-32 text-center hover:text-primary">Back</RouterLink>
        </div>
    </div>

  <div class="p-4 mt-4 text-center">
    <VideoPlayer v-if="currentVideoUrl" :url="currentVideoUrl" />
    <!-- Button to fetch more videos -->
    <Button
      @click="fetchVideos"
      class="mt-5"
      :loading="loading"
    >
      Refresh Videos
    </Button>
  </div>    

    <div class="text-center">
      <label class="text-xl"> Video Buttons </label>
    </div>

    <div class="mx-auto flex justify-center">
        <div class="mt-4 mb-4 flex space-x-2">
        <Button
            v-for="video in videos"
            :key="video"
            @click="setVideo(video)"
            class="w-32 truncate"
            :loading="loading"
            
        >
            {{ video }}
        </Button>
        </div>
    </div>
   
</template>
