import { defineStore } from 'pinia'
import type { Collection } from '@/types/entities'
import { JunoCollectionAPI } from '@/api/junoCollectionAPI'

export const useCollectionStore = defineStore('collection', {
  state: () => ({
    collection: {
      collection_name: '',
      collection_image_url: ''
    } as Collection
  }),
  actions: {
    setName(value: string) {
      this.collection.collection_name = value
    },
    setCollectionType(value: string) {
      this.collection.collection_type = value
    },
    setImageUrl(value: string) {
      this.collection.collection_image_url = value
    },
    async saveCollectionToDB() {
      const junoCollectionAPI = new JunoCollectionAPI()

      try {
        const CollectionCopy = JSON.parse(JSON.stringify(this.collection))

        const collection = await junoCollectionAPI.createOrUpdateCollection(CollectionCopy)
        console.log('collection:', collection)
      } catch (error) {
        console.error('Failed to save collection:', error)
      }
    }
  }
})
