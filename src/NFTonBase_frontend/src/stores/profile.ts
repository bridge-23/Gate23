import { defineStore } from 'pinia'
import type { Profile } from '@/types/entities'
import { JunoProfileAPI } from '@/api/junoProfileAPI'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    profile: {
      id: '',
      nft_address: '',
      merchant_industry: '',
      merchant_name: '',
      merchant_address: '',
      merchant_image_url: '',
      onboarding_completed: false
    } as Profile
  }),
  actions: {
    setId(id: string) {
      this.profile.id = id
    },
    setAddress(value: string) {
      this.profile.nft_address = value
    },
    setActivity(activity: string) {
      this.profile.merchant_industry = activity
    },
    setShopDetails(name: string, address: string) {
      this.profile.merchant_name = name
      this.profile.merchant_address = address
    },
    setOnboardingCompleted() {
      this.profile.onboarding_completed = true
    },
    // setCollectionDetails(name: string, type: string, itemType: string) {
    //   // Save collection details to the profile or any other logic you need
    //   this.profile.merchant_image_url = '' // Add logic to set the image URL
    // },
    async saveProfileToDB() {
      const junoProfileAPI = new JunoProfileAPI()

      // Implement the logic to save the profile to the database
      try {
        // Create a plain object copy of the profile
        const profileCopy = JSON.parse(JSON.stringify(this.profile))

        const userProfile = await junoProfileAPI.createOrUpdateProfile(profileCopy.id, profileCopy)
      } catch (error) {
        console.error('Failed to save profile:', error)
      }
    },
    clearProfile() {
      localStorage.removeItem('profile')
      
      this.profile = {
        id: '',
        nft_address: '',
        merchant_industry: '',
        merchant_name: '',
        merchant_address: '',
        merchant_image_url: '',
        onboarding_completed: false
      } as Profile
    }
  }
})
