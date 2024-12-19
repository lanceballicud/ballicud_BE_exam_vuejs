<script setup>
import NavItem from "../components/NavItem.vue"
import {HomeModernIcon, NewspaperIcon, VideoCameraIcon} from "@heroicons/vue/24/solid"
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useRouter } from "vue-router"
import { computed, onMounted, ref } from "vue"
import { useAuthStore } from "@/stores/auth"
import { useProductsStore } from "@/stores/products"
import SearchForm from '../components/SearchForm.vue'
import FilterBox from "@/components/FilterBox.vue"
import ConfirmPopup from 'primevue/confirmpopup'
import { useConfirm } from "primevue/useconfirm"
import { useToast } from "primevue/usetoast"
import Toast from 'primevue/toast'


const loading = ref(false)
const confirm = useConfirm()
const toast = useToast()
const router = useRouter()
const authStore = useAuthStore()
const { getAllProducts, deleteProduct } = useProductsStore()

const selectedCategories = ref([])
const searchFilter = ref('')
const products = ref([])

const navItems = [
  {href: "/dashboard", active: false, label: "Home", children: [], icon: HomeModernIcon},
  {
    href: "#", active: false,
    label: "Products",
    children: [
      {href: "/dashboard", active: false, label: "All Products", children: [], icon: null},
      {href: "/create", active: false, label: "Add New", children: [], icon: null},
  ], icon: NewspaperIcon},
  {href: "/videos", active: false, label: "Video Player", children: [], icon: VideoCameraIcon},
]

onMounted( async () => products.value = await getAllProducts())

const filteredItems = computed(() => {
  return products.value.filter(item => {

    const matchesSearchFilter = item.name.toLowerCase().includes(searchFilter.value.toLowerCase()) || 
                                item.description.toLowerCase().includes(searchFilter.value.toLowerCase())

    const matchesCategoryFilter = selectedCategories.value.length === 0 || selectedCategories.value.includes(item.category_name)

    return matchesSearchFilter && matchesCategoryFilter
  })
})

const handleSearch = (search) => {
  searchFilter.value = search
}

const handleCheckBoxFilter = (filter) => {
  selectedCategories.value = filter
}


const handleDeleteProduct = async (id) => {
  confirm.require({
        message: 'Do you want to delete this record?',
        header: 'Confirmation',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Delete',
            severity: 'danger'
        },
        accept: async () => {
          try {
            products.value = await deleteProduct(id, products.value)
            toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 })
          } catch (error) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete record', life: 3000 })
          }
            
        },
        reject: () => {
            toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 })
        }
    })
}


const formatDate = (datetime) => {
  if (!datetime) return ''
  const date = new Date(datetime)
  return date.toLocaleString('en-US', {
    weekday: 'short', 
    year: 'numeric',
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

</script>
<template>
  <div class="flex min-h-screen">
    <div class="w-64 shrink-0 border-r border-gray-200 bg-gray-50">
      <div class="px-4 w-full h-32">
          <div class="w-full h-1/2 border-b-2 border-b-gray-400 flex items-center space-x-5">
              <div class="w-12 h-12">
                <Avatar icon="pi pi-user" class="mr-2" size="large" style="background-color: #ece9fc; color: #2a1261" shape="circle" />

              </div>
              <label class="text-gray-600">
                Admin Dashboard
              </label>
          </div>
          <div  class="w-full h-1/2 border-b-2 border-b-gray-400 flex items-center space-x-5">
            <div class="w-12 h-12">
              <Avatar icon="pi pi-user" class="mr-2" size="large" style="background-color: #ece9fc; color: #2a1261" shape="circle" />

            </div>
            <label class="text-gray-600"  >
              <h1 v-if="authStore.user">Welcome, {{ authStore.user.name }}</h1>
            </label>
          </div>
      </div>

      <nav class="mt-6 px-2">
        <NavItem
          :item="item"
          v-for="item in navItems"
          :key="item.label"
        />
      </nav>
    </div>

    <main class="w-full">
      <div class="w-full h-16 flex flex-row justify-between border-b-2 border-gray-200">
        <div class="h-full w-96 flex justify-center items-center">
          
          <SearchForm @search="handleSearch" />


        </div>
        <div class="w-48 h-full flex items-center justify-center">
            <label @click="authStore.logout" class="text-gray-600 border-l-2 border-gray-600 w-32 text-center hover:text-primary cursor-pointer">Logout</label>

          </div>
      </div>


      <div class="w-full h-full px-5">
        <div class="w-full h-full">

          <div v-if="products.length > 0">
            <DataTable :value="filteredItems" stripedRows paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem">
              <template #header>
                  <div class="flex flex-wrap items-center justify-between gap-2">
                      <span class="text-xl font-bold">Products</span>

                      <div class=" w-[500px] h-full flex flex-row justify-between">
                        <div class="w-52 h-full">
                          <FilterBox :products="products" @filter='handleCheckBoxFilter' />

                        </div>
                        <Button @click="() => router.push({ name: 'create' })" label="Product" icon="pi pi-plus" class="w-32" />

                      </div>
                  </div>
              </template>
              <Column field="name" header="Name" style="width: 20%"></Column>
              <Column field="description" header="Description" class="" style="width: 25%">
                <template #body="slotProps">
                    <div class="line-clamp-2 w-full" title="slotProps.data.description">
                        {{ slotProps.data.description }}
                    </div>
                </template>
              </Column>
              <Column header="Image" style="width: 20%">
                  <template #body="slotProps">
                      <img :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`" :alt="slotProps.data.image" class="w-24 rounded" />
                  </template>
              </Column>
              <Column field="category_name" header="Category" style="width: 15%">
              
              </Column>
              <Column field="datetime" header="Date & Time" style="width: 20%">
                <template #body="slotProps">
                  <div>{{ formatDate(slotProps.data.datetime) }}</div>
                </template>
              </Column>
              <Column header="Action" style="width: 20%">
                
              <template #body="slotProps">
                <div class="flex flex-row space-x-2">
                  <Toast />
                  <ConfirmPopup></ConfirmPopup>
                  <Button @click="() => router.push({name: 'update', params: {id: slotProps.data.id}})" icon="pi pi-pencil" severity="info" />
                  <Button @click="() => handleDeleteProduct(slotProps.data.id)" icon="pi pi-trash" severity="danger" />
                </div>                
              </template>

            

              </Column>
              <template #footer> In total there are {{ products ? products.length : 0 }} products. </template>
          </DataTable>
        </div>

          <div v-else class="w-full flex justify-center items-center mt-10">
            <h1 class="text-2xl"> There are no Products. Try creating.</h1>
          </div>


        </div>
      </div>
    </main>
  </div>
</template>