<template>
  <div class="container">
    <h3 class="text-center my-4">Add Product</h3>
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-6">
        <q-input v-model="title" label="Title (Name)" outlined dense />
      </div>
      <div class="col-span-6">
        <q-select
          v-model="selectedCollection"
          label="Collection"
          outlined
          dense
          :options="collectionOptions"
          option-value="id"
          option-label="collection_name"
        />
      </div>
      <div class="col-span-6">
        <q-input v-model="description" label="Description" outlined dense autogrow />
      </div>
      <div class="col-span-6"></div>
      <div class="col-span-6 flex flex-col">
        <label>Media</label>
        <q-file
          dense
          outlined
          v-model="media"
          @update:model-value="updatedFile"
          @clear="removeFile"
        >
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
          <template v-slot:append>
            <q-icon name="close" @click="removeFile" class="cursor-pointer" />
          </template>
        </q-file>
        <q-img
          :src="imageLink"
          fit="contain"
          spinner-color="white"
          class="w-full aspect-square my-3 border-[#1976D2] border-[2px] rounded-md"
        />
      </div>
      <div class="col-span-6">
        <label>Price</label>
        <div class="grid grid-cols-2 gap-4">
          <q-input v-model="price" label="Price" outlined dense />
        </div>
      </div>
      <div class="col-span-12 flex justify-end">
        <q-btn label="Save" no-caps class="btn-next" @click="saveProduct" />
      </div>
      <input
        v-model="mintResult"
        placeholder="Mint result"
        readonly
        class="w-full p-2 bg-transparent border border-gray-500 rounded-md text-white mt-3"
      />
    </div>
    <q-inner-loading
      :showing="visible"
      label="Processing..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import { useCollectionStore } from '@/stores/collection'
import { useProductStore } from '@/stores/product'
import { useProfileStore } from '@/stores/profile'
import { resizeAndGrayscaleImage } from '@/utils/resizeAndGrayscaleImage'
import { convertToDataURL } from '@/utils/image.js'
import { nanoid } from 'nanoid'
import { Actor, HttpAgent } from '@dfinity/agent'
import { idlFactory as NFTonBase_idlFactory } from '@/utils/backend.did'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const canisterId = 'tkuag-tqaaa-aaaak-akvgq-cai' as string
const agent = new HttpAgent({ host: 'https://ic0.app' })
const actor = Actor.createActor(NFTonBase_idlFactory, { agent, canisterId })
const authStore = useAuthStore()
const { isLogin, ethAddress } = storeToRefs(authStore)

// const comparePrice = ref('')
// const costPerItem = ref('')
// const profit = ref('')
// const margin = ref('')
// const variant = ref('Classic')
// const active = ref('Active')

const title = ref('')
const description = ref('')
const selectedCollection = ref<any>(null)
const media = ref(null)
const imageLink = ref('')
const price = ref()
const imageByteArray = ref()
const visible = ref(false)
const mintResult = ref('')
const uploadedDataURL = ref('')
const prifileStore = useProfileStore()
const collectionStore = useCollectionStore()
const productStore = useProductStore()

onMounted(() => {
  if (collectionStore.collections.length === 0) {
    collectionStore.fetchCollections()
  }
  console.log('profile', prifileStore.profile)
})

const collectionOptions = computed(() => collectionStore.collections)

const updatedFile = async (uploadFile: any) => {
  if (uploadFile) {
    const grayImage = await resizeAndGrayscaleImage(uploadFile)
    const reader = new FileReader()

    reader.onload = async (e) => {
      const arrayBuffer = await grayImage.arrayBuffer()
      const byteArray = new Uint8Array(arrayBuffer)
      imageByteArray.value = byteArray
      const chunks = []
      chunks.push(new Uint8Array(byteArray))

      const blob = new Blob(chunks, { type: 'image/jpeg' })

      let new_url = await convertToDataURL(blob)
      imageLink.value = new_url
    }

    reader.readAsArrayBuffer(grayImage)
  }
}

const uploadImage = async (docKey: string) => {
  const result = (await actor.upload_image(docKey, imageByteArray.value)) as string
  imageLink.value = `https://tkuag-tqaaa-aaaak-akvgq-cai.raw.icp0.io/image/${result}`
  console.log('uploadedImageURL', imageLink.value)
}

const uploadData = async (docKey: string, data: object) => {
  const result = (await actor.upload_data(docKey, JSON.stringify(data))) as string
  console.log('uploadedDataURL', result)
  uploadedDataURL.value = `https://tkuag-tqaaa-aaaak-akvgq-cai.raw.icp0.io/receipt/${result}`
}

const mintNFT = async () => {
  visible.value = true
  const result = (await actor.mint_nft(ethAddress.value, uploadedDataURL.value, 1)) as string
  mintResult.value = result
  visible.value = false
}

const removeFile = () => {
  imageLink.value = ''
  media.value = null
}

const saveProduct = async () => {
  visible.value = true
  
  const docKey = nanoid()
  const rawCollection = toRaw(selectedCollection.value)

  await uploadImage(docKey) // upload image to canister!!!

  productStore.setId(docKey)
  productStore.setCollectioId(rawCollection?.id)
  productStore.setImgUrl(imageLink.value)
  productStore.setNftData(mintResult.value)
  productStore.setName(title.value)
  productStore.setPrice(price.value)
  productStore.setCurrency('USD')
  productStore.setDescription(description.value)

  await uploadData(docKey, productStore.product);

  // const productJson = JSON.parse(JSON.stringify(productStore.product))
  // nftData.value = productJson as string

  await mintNFT() // mint NFT to canister!!!

  console.log('ethAddress', ethAddress.value)
  console.log('Product:', mintResult.value)
  await productStore.saveProductToDB() // save product to canister!!!

  visible.value = false
}
</script>

<style scoped>
/* General styles for the container */
.container {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 20px;
  width: 100%;
  max-width: 1000px;
  box-shadow: 0 8px 32px 0 rgb(149, 150, 151);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  margin: auto;
  margin-top: 20px;
  margin-bottom: 20px;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.col-span-6 {
  flex: 1 1 calc(50% - 20px);
}

.col-span-12 {
  flex: 1 1 100%;
}

.q-btn {
  margin-top: 10px;
}

/* Apply general styles to headers and buttons */
div,
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: 'Roboto', sans-serif;
}

button,
.q-btn {
  background-color: #959697;
  background-image: linear-gradient(to top, #959697 0%, #959697 100%);
  border: none;
  color: white;
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

button:hover,
.q-btn:hover {
  background-image: linear-gradient(to top, #959697 0%, #959697 100%);
}

button:active,
.q-btn:active {
  transform: scale(0.98);
}

/* Style for the next button */
/* .btn-next {
  background-color: #22ffae;
  background-image: linear-gradient(to top, #096a38 0%, #13e9c9 100%);
  border: none;
  color: white;
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  transition:
    background 0.3s ease,
    transform 0.2s ease;
  margin-top: 20px;
  width: 100%;
} */

/* .btn-next:hover {
  background-image: linear-gradient(to top, #13e9c9 0%, #096a38 100%);
} */

.btn-next:active {
  transform: scale(0.98);
}
</style>
