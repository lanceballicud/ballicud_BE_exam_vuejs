<script setup>
import FloatLabel from 'primevue/floatlabel'
import { InputText } from "primevue"

const emit = defineEmits(['search'])

const search = (e) => {
    emit('search', e.target.value)
}

</script>

<template>
    <div>
        <FloatLabel variant="on">
            <InputText id="on_label" @input="search" autocomplete="off" class="w-72" />
            <label for="on_label">Search</label>
        </FloatLabel>
    </div>
</template>