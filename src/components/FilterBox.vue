<script setup>
import MultiSelect from 'primevue/multiselect'
import { computed } from 'vue'

const props = defineProps({
    products: {
        type: Array,
        required: true
    }
})

const emit = defineEmits(['filter'])

const categories = computed(() => {
    return [...new Set(props.products.map(item => item.category_name))]
})

const filter = (e) => {
    emit('filter', e.value)
}

</script>

<template>
    <MultiSelect @change="filter" :options="categories" filter placeholder="Select categories" class="w-full md:w-72" />
</template>