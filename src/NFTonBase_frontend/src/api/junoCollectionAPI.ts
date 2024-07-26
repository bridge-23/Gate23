import { getDoc, setDoc } from '@junobuild/core'
import type { Collection } from '../types/entities'
import { getSatteliteOptions } from '../api'
import { nanoid } from 'nanoid'

// Constants
const COLLECTIONS_COLLECTION = 'collections'

export class JunoCollectionAPI {
  async fetchCollection(collectionKey: string): Promise<Collection | null> {
    const collections = await getDoc<Collection>({
      collection: COLLECTIONS_COLLECTION,
      key: collectionKey,
      satellite: getSatteliteOptions()
    })

    if (!collections) {
      return null
    }

    return { ...collections.data }
  }

  async createOrUpdateCollection(
    data: Partial<Collection>,
    collectionKey?: string
  ): Promise<Collection> {
    if (!data.collection_name) {
      throw new Error('Collection name is required')
    }

    const id = data.id || nanoid()

    data.id = id
    collectionKey = id

    try {
      // Fetch the existing document to get the version
      const existingDoc = await getDoc<Collection>({
        collection: COLLECTIONS_COLLECTION,
        key: collectionKey,
        satellite: getSatteliteOptions()
      })

      const version = existingDoc ? existingDoc.version : undefined

      await setDoc<Partial<Collection>>({
        collection: COLLECTIONS_COLLECTION,
        doc: {
          key: collectionKey,
          description: `@${data.collection_name}`,
          data: { ...data },
          version: version
        },
        satellite: getSatteliteOptions()
      })

      return data as Collection
    } catch (error) {
      console.error('Failed to create or update collection:', error)
      throw error
    }
  }
}
