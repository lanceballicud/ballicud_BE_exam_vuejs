<script setup>
defineProps({
  title: String,
});
</script>

<template>
    <div>
      <h2 class="text-xl font-bold mb-4">{{ title }}</h2>
      <slot></slot>
    </div>
  </template>