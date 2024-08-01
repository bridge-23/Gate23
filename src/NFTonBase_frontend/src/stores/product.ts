import { defineStore } from 'pinia'
import type { Product } from '@/types/entities'
import { JunoProductAPI } from '@/api/junoProductAPI'

export const useProductStore = defineStore('product', {
  state: () => ({
    product: {
      id: '',
      product_collection_id: '',
      nft_data: '',
      img_url: '',
      product_name: '',
      product_price: 0,
      product_currency: '',
      description: ''
    } as Product,
    products: [] as Product[]
  }),
  actions: {
    setId(id: string) {
      this.product.id = id
    },
    setCollectioId(id: string) {
      this.product.product_collection_id = id
    },
    setImgUrl(value: string) {
      this.product.img_url = value
    },
    setNftData(value: string) {
      this.product.nft_data = value
    },
    setName(value: string) {
      this.product.product_name = value
    },
    setPrice(value: number) {
      this.product.product_price = value
    },
    setCurrency(value: string) {
      this.product.product_currency = value
    },
    setDescription(value: string) {
      this.product.description = value
    },
    setAllProductData(products: Product[]) {
      this.products = products
    },
    async saveProductToDB() {
      const junoProductAPI = new JunoProductAPI()

      // Implement the logic to save the product to the database
      try {
        // Create a plain object copy of the product
        const productCopy = JSON.parse(JSON.stringify(this.product))

        const userProduct = await junoProductAPI.createOrUpdateProduct(productCopy)
        console.log('Product:', userProduct)
      } catch (error) {
        console.error('Failed to save product:', error)
      }
    },
    clearProduct() {
      localStorage.removeItem('product')

      this.product = {
        id: '',
        product_collection_id: '',
        img_url: '',
        nft_data: '',
        product_name: '',
        product_price: 0,
        product_currency: '',
        description: ''
      } as Product
    },
    async fetchProducts() {
      const junoCollectionAPI = new JunoProductAPI()
      try {
        const products = await junoCollectionAPI.fetchAll()
        this.setAllProductData(products)
      } catch (error) {
        console.error('Failed to fetch collections:', error)
      }
    }
  }
})
