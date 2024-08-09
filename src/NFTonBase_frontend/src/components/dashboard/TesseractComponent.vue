<template>
  <div class="container" v-if="isLogin">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-4 flex flex-col">
        <q-file
          dense
          outlined
          v-model="model"
          @update:model-value="updatedFile"
          @clear="removeFile"
          class="border-gray-500 border-[2px] rounded-md"
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
          class="my-3 border-gray-500 border-[2px] rounded-md w-full object-contain"
        />
      </div>
      <div class="col-span-4">
        <textarea
          v-model="detectedJsonData"
          readonly
          placeholder="Detected Receipt Data will appear here."
          class="w-full h-32 p-2 bg-transparent border border-gray-500 rounded-md text-white"
        />
      </div>
      <div class="col-span-4">
        <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <div>
            <button @click="onUploadImage" class="activity-button">Upload Image</button>
            <input
              v-model="uploadedImageURL"
              placeholder="Uploaded Image URL"
              readonly
              class="w-full p-2 bg-transparent border border-gray-500 rounded-md text-white mt-3"
            />
            <button @click="onUploadData" class="activity-button mt-3">Upload Receipt Data</button>
            <input
              v-model="uploadedDataURL"
              placeholder="Uploaded Receipt URL"
              readonly
              class="w-full p-2 bg-transparent border border-gray-500 rounded-md text-white mt-3"
            />
            <button @click="onMintNFT" class="activity-button mt-3">Mint NFT on Base Chain</button>
            <input
              v-model="mintResult"
              placeholder="Mint result"
              readonly
              class="w-full p-2 bg-transparent border border-gray-500 rounded-md text-white mt-3"
            />
          </div>
        </transition>
        <q-inner-loading
          :showing="visible"
          label="Processing..."
          label-class="text-teal"
          label-style="font-size: 1.1em"
        />
      </div>
    </div>
  </div>

  <q-page v-else class="flex justify-center items-center">
    <p class="text-[#1976D2] text-2xl font-semibold">Login first...</p>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { convertToDataURL } from '@/utils/image.js'
import { resizeAndGrayscaleImage } from '@/utils/resizeAndGrayscaleImage'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { NFTonBase_backend } from 'declarations/NFTonBase_backend/index'
import { nanoid } from 'nanoid'
import { HttpAgent, Actor } from '@dfinity/agent'
import { idlFactory } from '@/utils/recognition-backend.did'
import { idlFactory as NFTonBase_idlFactory } from '@/utils/backend.did'

// const canisterId = import.meta.env.VITE_RECOGNITION_BACKEND as string;
//       const agent = new HttpAgent({ host: 'https://ic0.app' });
//       const actor = Actor.createActor(idlFactory, { agent, canisterId });

const authStore = useAuthStore()
const { isLogin, ethAddress } = storeToRefs(authStore)

const model = ref(null)
const imageLink = ref('')
const detectedJsonData = ref('')
const visible = ref(false)
const uploadedImageURL = ref('')
const uploadedDataURL = ref('')
const mintResult = ref('')
const imageByteArray = ref()

const docKey = nanoid()
const canisterId = 'tkuag-tqaaa-aaaak-akvgq-cai' as string
const agent = new HttpAgent({ host: 'https://ic0.app' })
const actor = Actor.createActor(NFTonBase_idlFactory, { agent, canisterId })

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

const removeFile = () => {
  detectedJsonData.value = ''
  imageLink.value = ''
  model.value = null
}

const onUploadImage = async () => {
  visible.value = true
  const result = (await actor.upload_image(docKey, imageByteArray.value)) as string
  // const result = (await NFTonBase_backend.upload_image(docKey, imageByteArray.value)) as string
  uploadedImageURL.value = `https://tkuag-tqaaa-aaaak-akvgq-cai.raw.icp0.io/image/${result}`
  visible.value = false
}

// const onAnalyzeImage = async () => {
//   visible.value = true
//   const canisterId = '6kmvc-taaaa-aaaak-akunq-cai' as string
//   const agent = new HttpAgent({ host: 'https://ic0.app' })
//   const actor = Actor.createActor(idlFactory, { agent, canisterId })
//   const detectedData = (await actor.send_image_url_to_proxy(uploadedImageURL.value)) as string
//   let resultText = JSON.parse(detectedData).choices[0].message.content
//   let index = resultText.indexOf('{')
//   resultText = resultText.slice(index)
//   index = resultText.lastIndexOf('}')
//   resultText = resultText.substring(0, index + 1)
//   detectedJsonData.value = resultText
//   visible.value = false
// }

const onUploadData = async () => {
  visible.value = true
  let receiptJson = JSON.parse(detectedJsonData.value)
  receiptJson = { ...receiptJson, image_url: uploadedImageURL.value }
  // const result = (await NFTonBase_backend.upload_data(
  //   docKey,
  //   JSON.stringify(receiptJson)
  // )) as string
  const result = (await actor.upload_data(docKey, JSON.stringify(receiptJson))) as string
  uploadedDataURL.value = `https://tkuag-tqaaa-aaaak-akvgq-cai.raw.icp0.io/receipt/${result}`
  visible.value = false
}

const onMintNFT = async () => {
  visible.value = true
  const result = (await NFTonBase_backend.mint_nft(
    ethAddress.value,
    uploadedDataURL.value,
    1
  )) as string
  mintResult.value = result
  visible.value = false
}
</script>

<style scoped>
/* General styles for the container */
.container {
  width: 100%;
  max-width: 800px;
  margin-top: 50px;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.col-span-4 {
  flex: 1 1 calc(33.333% - 20px);
  display: flex;
  flex-direction: column;
}

.q-btn {
  margin-top: 10px;
}

button,
.q-btn {
  background-color: #1c92d2;
  background-image: linear-gradient(to top, #6224e7 0%, #3b60e8 100%);
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

/* Style for the next button */
.activity-button {
  padding: 10px;
  border: none;
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  cursor: pointer;
  transition:
    background 0.3s ease,
    transform 0.2s ease;
  border-radius: 5px;
  width: 100%;
}

.activity-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>
