<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div class="products-page">
    <h4>BTC <=> ckBTC Wallet</h4>
    <div class="flex flex-col gap-2 w-[50%]">
      <q-btn label="Get Wallet Address" color="primary" no-caps @click="onGetWalletAddress"></q-btn>
      <q-input placeholder="Result" v-model="walletAddressResult" readonly outlined dense />
      <q-btn label="Get Deposit Address" color="primary" no-caps @click="onGetDepositAddress"></q-btn>
      <q-input placeholder="Result" v-model="addressResult" readonly outlined dense />
      <q-input placeholder="Error" v-model="addressError" readonly outlined dense />
      <div>
        <q-btn label="Get ckBTC Balance" color="primary" no-caps @click="onGetBTCBalance"></q-btn>
        <q-btn label="Get ckUSDC Balance" color="primary" no-caps @click="onGetUSDCBalance"></q-btn>
      </div>
      <q-input placeholder="Result" v-model="balanceResult" readonly outlined dense />
      <q-input placeholder="Error" v-model="balanceError" readonly outlined dense />
      <q-btn label="Update balance" color="primary" no-caps @click="onUpdateBalance"></q-btn>
      <q-input placeholder="Result" v-model="updateResult" readonly outlined dense />
      <q-input placeholder="Error" v-model="updateError" readonly outlined dense />
      <q-btn label="Transfer ckBTC" color="primary" no-caps @click="onTransfer"></q-btn>
      <q-input placeholder="Input user principal" v-model="transferDestination" outlined dense />
      <q-input placeholder="Input amount" type="number" v-model="transferAmount" outlined dense />
      <q-input placeholder="Result" v-model="transferResult" readonly outlined dense />
      <q-input placeholder="Error" v-model="transferError" readonly outlined dense />
      <q-btn label="withdraw" color="primary" no-caps @click="onWithdraw"></q-btn>
      <q-input placeholder="Input BTC Address" v-model="withdrawDestination" outlined dense />
      <q-input placeholder="Input amount" type="number" v-model="withdrawAmount" outlined dense />
      <q-input placeholder="Result" v-model="withdrawResult" readonly outlined dense />
      <q-input placeholder="Error" v-model="withdrawError" readonly outlined dense />
    </div>
    <q-inner-loading
      :showing="isLoading"
      label="Loading..."
      label-class="text-black"
      label-style="font-size: 1.3em"
    />
  </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { HttpAgent, Actor } from '@dfinity/agent'
import { idlFactory as NFTonBase_idlFactory } from '@/utils/backend.did'

const canisterId = 'tkuag-tqaaa-aaaak-akvgq-cai' as string
const agent = new HttpAgent({ host: 'https://ic0.app' })
const actor = Actor.createActor(NFTonBase_idlFactory, { agent, canisterId })

const authStore = useAuthStore()
const { principal } = storeToRefs(authStore)
const isLoading = ref(false)
const walletAddressResult = ref("")
const addressResult = ref("")
const addressError = ref("")
const balanceResult = ref("")
const balanceError = ref("")
const updateResult = ref("")
const updateError = ref("")
const transferDestination = ref("")
const transferAmount = ref<number>()
const transferResult = ref("")
const transferError = ref("")
const withdrawDestination = ref("")
const withdrawAmount = ref<number>()
const withdrawResult = ref("")
const withdrawError = ref("")


const onGetWalletAddress = async () => {
  isLoading.value = true
  const result = (await actor.get_address(principal.value)) as string
  walletAddressResult.value = result
  isLoading.value = false
}

const onGetDepositAddress = async () => {
  isLoading.value = true
  const result = (await actor.deposit_btc(principal.value)) as [string, string]
  addressResult.value = result[0]
  addressError.value = result[1]
  isLoading.value = false
}

const onGetBTCBalance = async () => {
  isLoading.value = true
  const result = (await actor.get_btc_balance(principal.value)) as [string, string]
  balanceResult.value = result[0]
  balanceError.value = result[1]
  isLoading.value = false
}

const onGetUSDCBalance = async () => {
  isLoading.value = true
  const result = (await actor.get_usdc_balance(principal.value)) as [string, string]
  balanceResult.value = result[0]
  balanceError.value = result[1]
  isLoading.value = false
}

const onUpdateBalance = async () => {
  isLoading.value = true
  const result = (await actor.update_btc_balance(principal.value)) as [number, string]
  updateResult.value = Number(result[0]).toString()
  updateError.value = result[1]
  isLoading.value = false
  
}

const onTransfer = async () => {
  if(!transferDestination.value){
    alert('Input Use Principal')
    return
  }
  if(!transferAmount.value || transferAmount.value == 0){
    alert('Input Transfer Amount')
    return
  }
  isLoading.value = true
  const result = (await actor.transfer_btc(principal.value, transferDestination.value, BigInt(transferAmount.value))) as [string, string]
  transferResult.value = result[0]
  transferError.value = result[1]
  isLoading.value = false
}

const onWithdraw = async () => {
  if(!withdrawDestination.value){
    alert('Input BTC Address')
    return
  }
  if(!withdrawAmount.value || withdrawAmount.value == 0){
    alert('Input Withdraw Amount')
    return
  }
  isLoading.value = true
  const result = (await actor.withdraw_btc(principal.value, withdrawDestination.value, BigInt(withdrawAmount.value))) as [string, string]
  withdrawResult.value = result[0]
  withdrawError.value = result[1]
  isLoading.value = false
}

</script>

<style scoped>
.products-page {
  padding: 20px;
}

.table-container {
  overflow-x: auto; /* To allow horizontal scrolling for small screens */
}

.products-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.products-table th, .products-table td {
  border: 1px solid #e0e0e0;
  padding: 10px;
  text-align: left;
}

.products-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.product-image {
  width: 50px;
  height: 50px;
}

.no-image {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  color: #888;
}

.status-label {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 4px;
  background-color: #d4f4dd; /* Example for "Active" */
  color: #007e33; /* Dark green text */
  font-size: 0.9em;
}

.status-label1 {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 4px;
  background-color: #0b4ba9; /* Example for "Active" */
  color: #f5f6f6; /* Dark green text */
  font-size: 0.9em;
}

.products-table tr:nth-child(even) {
  background-color: #fafafa;
}
</style>