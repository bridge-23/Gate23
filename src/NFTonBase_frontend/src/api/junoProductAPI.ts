import { getDoc, listDocs, setDoc } from '@junobuild/core'
import type { Product } from '../types/entities'
import { getSatteliteOptions } from '../api'
import { nanoid } from 'nanoid'

// Constants
const PRODUCTS_COLLECTION = 'products'

export class JunoProductAPI {
  async fetchProduct(productKey: string): Promise<Product | null> {
    const products = await getDoc<Product>({
      collection: PRODUCTS_COLLECTION,
      key: productKey,
      satellite: getSatteliteOptions()
    })

    if (!products) {
      return null
    }

    return { ...products.data }
  }

  async fetchAll(): Promise<Product[]> {
    const response = await listDocs<Product>({
      collection: PRODUCTS_COLLECTION,
      satellite: getSatteliteOptions(),
    });

    if (!response.items) {
      return [];
    }

    return response.items.map((doc) => ({ ...doc.data, id: doc.key }));
  }

  async createOrUpdateProduct(
    data: Partial<Product>,
    productKey?: string
  ): Promise<Product> {
    if (!data.product_name) {
      throw new Error('Product name is required')
    }

    const id = data.id || nanoid()

    data.id = id
    productKey = id

    try {
      // Fetch the existing document to get the version
      const existingDoc = await getDoc<Product>({
        collection: PRODUCTS_COLLECTION,
        key: productKey,
        satellite: getSatteliteOptions()
      })

      const version = existingDoc ? existingDoc.version : undefined

      await setDoc<Partial<Product>>({
        collection: PRODUCTS_COLLECTION,
        doc: {
          key: productKey,
          description: `@${data.product_name}`,
          data: { ...data },
          version: version
        },
        satellite: getSatteliteOptions()
      })

      return data as Product
    } catch (error) {
      console.error('Failed to create or update product:', error)
      throw error
    }
  }
}
