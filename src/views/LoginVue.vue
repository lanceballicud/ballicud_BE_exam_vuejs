<script setup>
import { onMounted, reactive } from 'vue'
import InputText from 'primevue/inputtext'
import { Message } from 'primevue'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { errors } = storeToRefs(authStore)
const { authenticate } = authStore

const formData = reactive({
    identifier: '',
    password: '',
    remember: false,
})

onMounted(() => (errors.value = {}))

</script>



<template>
    <div class="w-full h-16 flex flex-row justify-between border-b-2 border-gray-200">
        <div class="h-full w-96 flex justify-center items-center">
            <label class="text-xl font-bold">Login</label>
        </div>
        <div class="w-48 h-full flex items-center justify-center">
        </div>
    </div>

    <main>
        <div class="w-full h-full flex justify-center">
            <div class="w-[500px] h-[500px] bg-white rounded shadow-lg mt-20 p-10">
                <div class="w-full h-1/6 flex items-center border-b-2 border-primary mb-10 ">
                    <label class="text-primary  text-2xl ml-8 font-bold">Log in</label>
                </div>
                <div class="w-full h-5/6 ">
                    <div class="flex flex-col gap-2">
                        <label for="username">Username</label>
                        <InputText id="username" v-model="formData.identifier"/>
                        <Message v-if="errors" size="small" severity="error" variant="simple">{{errors.message || errors.identifier}}</Message>

                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="password">Password</label>
                        <InputText type="password" id="password" v-model="formData.password" />
                        <Message v-if="errors" size="small" severity="error" variant="simple">{{errors.password}}</Message>
                    </div>
                    <div class="w-full h-1/6 flex justify-start items-center">
                        <Checkbox v-model="formData.remember" binary />
                        <label class="ml-5">Keep me logged in.</label>
                    </div>
                    <div class="w-full h-1/6 flex justify-start items-center">
                        <Button @click="authStore.authenticate(formData)" label="Log in" class="rounded-3xl w-28"/>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>