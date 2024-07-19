<template>
  <div class="px-20 py-10" v-if="isLogin">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-4 flex flex-col">
        <q-file
          dense
          outlined
          v-model="model"
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
      <div class="col-span-4">
        <q-input
          v-model="detectedJsonData"
          outlined
          readonly
          autogrow
          placeholder="Detected Receipt Data will appear here."
          class="bg-transparent"
        />
      </div>
      <div class="col-span-4">
        <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <div>
            <q-btn
              label="Upload Image"
              color="primary"
              no-caps
              class="!w-full mb-3"
              @click="onUploadImage"
            />
            <q-input
              v-model="uploadedImageURL"
              placeholder="Uploaded Image URL"
              outlined
              readonly
              autogrow
            />
            <q-btn
              label="Analyze Image"
              color="primary"
              no-caps
              class="!w-full mt-3"
              @click="onAnalyzeImage"
            />
            <q-btn
              label="Upload Receipt Data"
              color="primary"
              no-caps
              class="!w-full my-3"
              @click="onUploadData"
            />
            <q-input
              v-model="uploadedDataURL"
              placeholder="Uploaded Receipt URL"
              outlined
              readonly
              autogrow
            />
            <q-btn
              @click="onMintNFT"
              label="Mint NFT on Base Chain"
              color="primary"
              no-caps
              class="!w-full my-3"
            />
            <q-input v-model="mintResult" placeholder="Mint result" outlined readonly autogrow />
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
  const docKey = nanoid()
  const result = (await NFTonBase_backend.upload_image(docKey, imageByteArray.value)) as string
  uploadedImageURL.value = `https://tkuag-tqaaa-aaaak-akvgq-cai.raw.icp0.io/image/${result}`
  visible.value = false
}

const onAnalyzeImage = async () => {
  visible.value = true
  const canisterId = '6kmvc-taaaa-aaaak-akunq-cai' as string
  const agent = new HttpAgent({ host: 'https://ic0.app' })
  const actor = Actor.createActor(idlFactory, { agent, canisterId })
  const detectedData = (await actor.send_image_url_to_proxy(uploadedImageURL.value)) as string
  console.log('detectedData', detectedData)
  let resultText = JSON.parse(detectedData).choices[0].message.content
  let index = resultText.indexOf('{')
  resultText = resultText.slice(index)
  index = resultText.lastIndexOf('}')
  resultText = resultText.substring(0, index + 1)
  detectedJsonData.value = resultText
  console.log('receiptData', JSON.parse(resultText))
  visible.value = false
}

const onUploadData = async () => {
  visible.value = true
  let receiptJson = JSON.parse(detectedJsonData.value)
  receiptJson = { ...receiptJson, image_url: uploadedImageURL.value }
  console.log(receiptJson)
  const docKey = nanoid()
  const result = (await NFTonBase_backend.upload_data(
    docKey,
    JSON.stringify(receiptJson)
  )) as string
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
