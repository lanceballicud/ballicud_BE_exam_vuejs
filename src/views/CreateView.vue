<script setup>
import { RouterLink } from 'vue-router'
import { onMounted, ref } from 'vue'
import { z } from 'zod'
import { Button, InputText } from 'primevue'
import FloatLabel from 'primevue/floatlabel'
import FormStep from '@/components/FormStep.vue'
import Select from 'primevue/select'
import { useProductsStore } from '@/stores/products'

const productStore = useProductsStore()

onMounted(() => {
  productStore.getAllProducts()
})

const step1 = z.object({
  name: z.string().min(1, "Name is required"),
  category_name: z.string().min(1, "Category is required"), 
  description: z.string().min(1, "Description is required"),
})

const step2 = z.object({
  image: z.instanceof(File, { message: "Image is required" }),
})

const step3 = z.object({
  datetime: z.string().min(1, "Date & Time is required"),
})

const currentStep = ref(1)
const formData = ref({
  name: "",
  category_name: "",
  description: "",
  image: null,
  datetime: "",
})
const errors = ref({})

const validateStep = () => {
  errors.value = {}
  try {
    if (currentStep.value === 1) step1.parse(formData.value)
    else if (currentStep.value === 2) step2.parse(formData.value)
    else if (currentStep.value === 3) step3.parse(formData.value)
    return true
  } catch (e) {
    errors.value = e.format()
    return false
  }
}

const nextStep = () => {
  if (validateStep()) currentStep.value++
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

const submitForm = (formData) => {
  if (validateStep()) {
    productStore.createProduct(formData)
    console.log("Form submitted successfully:", formData.value)
  }
}

</script>

<template>
    <div class="w-full h-16 flex flex-row justify-between border-b-2 border-gray-200">
        <div class="h-full w-96 flex justify-center items-center">

            <label class="text-xl font-bold">Create Product</label>

        </div>
        <div class="w-48 h-full flex items-center justify-center">
            <RouterLink :to="{name: 'dashboard'}" class="text-gray-600 border-l-2 border-gray-600 w-32 text-center hover:text-primary">Back</RouterLink>
        </div>
    </div>


    <div class="max-w-xl mx-auto p-8 bg-white rounded shadow-lg mt-20">
    <!-- Step Navigation -->
      <div class="flex justify-between mb-6">
        <div
          v-for="step in 3"
          :key="step"
          :class="[
            'w-1/3 text-center py-2 font-medium',
            step === currentStep ? 'text-primary border-b-2 border-primary' : 'text-gray-400',
          ]"
        >
          <!-- Step {{ step }} -->
          <div v-if="step===1">
              Basic Details
          </div>
          <div v-else-if="step===2">
              Image
          </div>
          <div v-if="step===3">
              Date and Time
          </div>
        </div>
      </div>

    <!-- Step 1: Basic Details -->
    <div v-if="currentStep === 1">
      <FormStep title="Basic Details">
        <div>
            <FloatLabel class="block mt-6">
                <InputText v-model="formData.name" type="text" id="over_label" class="w-full p-2 border rounded" />
                <label for="over_label">Product Name</label>
            </FloatLabel>  
          <p class="text-red-500 text-sm">{{ errors?.name?._errors?.[0] }}</p>
        </div>

        <div>
            <FloatLabel class="block mt-6">
                <Select v-model="formData.category_name" inputId="over_label" :options="productStore.categories" class="w-full" />
                <label for="over_label">Categories</label>
            </FloatLabel> 
          <p class="text-red-500 text-sm">{{ errors?.category_name?._errors?.[0] }}</p>
        </div>

        <div>
            <FloatLabel class="block mt-6">
                <InputText v-model="formData.description" type="text" id="over_label" class="w-full p-2 border rounded" />
                <label for="over_label">Description</label>
            </FloatLabel>
          <p class="text-red-500 text-sm">{{ errors?.description?._errors?.[0] }}</p>
        </div>
      </FormStep>
    </div>

    <!-- Step 2: Image Upload -->
    <div v-if="currentStep === 2">
      <FormStep title="Upload Image">
        <div>
          <label class="block mb-1">Image</label>
          <input
            type="file"
            @change="(e) => (formData.image = e.target.files[0])"
            class="w-full p-2 border rounded"
          />
          <!-- <FileUpload ref="fileupload" mode="basic" @change="(e) => (formData.image = e.target.files[0])"  accept="image/*" :maxFileSize="1000000" /> -->

          <p class="text-red-500 text-sm">{{ errors?.image?._errors?.[0] }}</p>
        </div>
      </FormStep>
    </div>

    <!-- Step 3: Date & Time -->
    <div v-if="currentStep === 3">
      <FormStep title="Date & Time">
        <div>
          <label class="block mb-1">Date & Time</label>
          <input
            v-model="formData.datetime"
            type="datetime-local"
            class="w-full p-2 border rounded"
          />
          <p class="text-red-500 text-sm">{{ errors?.datetime?._errors?.[0] }}</p>
        </div>
      </FormStep>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex justify-between mt-6">
      <Button
        v-if="currentStep > 1"
        @click="prevStep"
        severity="secondary"
      >
        Previous
      </Button>

      <Button
        v-if="currentStep < 3"
        @click="nextStep"
        severity="info"
        >
        Next
      </Button>

      <Button
        v-if="currentStep === 3"
        @click="submitForm(formData)"
        class="success text-white px-4 py-2 rounded"
      >
        Submit
      </Button>
    </div>
  </div>
    
</template>