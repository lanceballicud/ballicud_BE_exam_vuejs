<script setup>
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import { RouterLink, useRoute } from 'vue-router'
import { onMounted, reactive, ref } from 'vue'
import Select from 'primevue/select'
import Button from 'primevue/button'
import { useProductsStore } from '@/stores/products'
import axios from 'axios'
import { z } from 'zod'

const route = useRoute()
const { getProduct, updateProduct } = useProductsStore()

const id = route.params.id
const product = ref(null)
const categories = ref([])

const fetchCategories = async () => {
  try {
    const res = await axios.get('/api/categories')
    categories.value = res.data
    console.log(categories.value)

  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const validationSchema = z.object({
  name: z.string().min(1, "Product Name is required"),
  category_name: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  image: z.instanceof(File, { message: "Image is required" }).optional(),
  datetime: z.string().min(1, "Date & Time is required"),
})

const errors = reactive({
  name: "",
  category_name: "",
  description: "",
  image: "",
  datetime: "",
})

const formData = reactive({
  name: "",
  category_name: null,
  description: "",
  image: null,
  datetime: "",
})

onMounted( async() => {
    await fetchCategories()

    product.value = await getProduct(id)

    formData.name = product.value.name
    formData.category_name = product.value.category_name    
    formData.description = product.value.description
    formData.image = product.value.image
    formData.datetime = product.value.datetime
    console.log(formData)
})

const validateForm = () => {
  Object.keys(errors).forEach((key) => {
    errors[key] = ""
  })

  try {
    validationSchema.parse(formData)
    return true
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Set error messages
      error.errors.forEach((err) => {
        errors[err.path[0]] = err.message
      })
    }
    return false
  }
}

const handleUpdateProduct = () => {
  if (validateForm()) {
    updateProduct(id, formData)
  }
}

</script>

<template>
    <div class="w-full h-16 flex flex-row justify-between border-b-2 border-gray-200">
        <div class="h-full w-96 flex justify-center items-center">

            <label class="text-xl font-bold">Update Product</label>

        </div>
        <div class="w-48 h-full flex items-center justify-center">
            <RouterLink :to="{name: 'dashboard'}" class="text-gray-600 border-l-2 border-gray-600 w-32 text-center hover:text-primary">Back</RouterLink>
        </div>
    </div>

    <div class="max-w-3xl mx-auto p-8 rounded shadow-lg mt-20 flex flex-row">
        <div class="w-1/2 h-80 pr-5">
            <h1 class="text-xl font-bold">Basic Details</h1>
           
    
            <div>
                <FloatLabel class="block mt-6">
                    <InputText v-model="formData.name" type="text" id="over_label" class="w-full p-2 border rounded" />
                    <label for="over_label">Product Name</label>
                </FloatLabel>  
                <p class="text-red-500 text-sm">{{ errors.name }}</p>
            </div>

            <div>
                <FloatLabel class="block mt-6">
                    <Select v-model="formData.category_name" inputId="over_label" :options='categories' optionLabel="name" optionValue="name" class="w-full" />
                    <label for="over_label">Categories</label>
                </FloatLabel> 
                <p class="text-red-500 text-sm">{{ errors.category_name }}</p>
            </div>

            <div>
                <FloatLabel class="block mt-6">
                    <InputText v-model="formData.description" type="text" id="over_label" class="w-full p-2 border rounded" />
                    <label for="over_label">Description</label>
                </FloatLabel>
                <p class="text-red-500 text-sm">{{ errors.description }}</p>
            </div>
        </div>
        <div class="w-1/2 h-80 pl-5">

                <div class="w-full h-1/3 flex items-center">
                    <div>
                        <label class="block">Image</label>
                        <input
                            type="file"
                            @change="(e) => (formData.image = e.target.files[0])"
                            class="w-full p-2 border rounded"
                        />

                        <p class="text-red-500 text-sm">{{ errors.image }}</p>
                    </div>
                </div>
                <div class="w-full h-1/3 flex items-center">
                    <div>
                        <label class="block">Date & Time</label>
                        <input
                            v-model="formData.datetime"
                            type="datetime-local"
                            class="w-full p-2 border rounded"
                        />
                        <p class="text-red-500 text-sm">{{ errors.datetime }}</p>
                    </div>
                </div>
                <div class=" w-full h-1/3 flex justify-end items-end">
                    <div class="w-28 h-12 flex justify-center items-center">
                        <Button @click="handleUpdateProduct" label="Update" />
                    </div>
                </div>
        </div>

    </div>
</template>