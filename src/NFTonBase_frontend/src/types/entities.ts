export interface Profile {
  id: string
  nft_address: string
  merchant_industry: string
  merchant_name: string
  merchant_address: string
  merchant_image_url: string
  onboarding_completed: boolean
}

export interface Product {
  id: string
  nft_data: string
  img_url: string
  product_collection_id: string
  product_name: string
  product_price: number
  product_currency: string
  description?: string
}

export interface Collection {
  id: string
  collection_name: string
  collection_type: string
  collection_image_url?: string
  products?: Product[]
}
