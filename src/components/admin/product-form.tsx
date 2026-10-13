"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Plus, Trash2, Upload, X } from "lucide-react"

interface ProductVariantForm {
  id: string
  name: string
  sku: string
  price: number
  inventory: number
  options: Record<string, string>
}

interface ProductFormProps {
  initialData?: {
    id: string
    name: string
    slug: string
    description: string
    shortDescription: string
    price: number
    compareAtPrice?: number
    images: string[]
    categoryId: string
    tags: string[]
    sku: string
    weight?: number
    dimensions?: { length: number; width: number; height: number }
    isActive: boolean
    isFeatured: boolean
    variants: ProductVariantForm[]
  }
  categories: Array<{ id: string; name: string }>
  onSubmit: (data: FormData) => Promise<void>
  isLoading: boolean
}

export function ProductForm({ initialData, categories, onSubmit, isLoading }: ProductFormProps) {
  const router = useRouter()
  const [images, setImages] = React.useState<string[]>(initialData?.images || [])
  const [variants, setVariants] = React.useState<ProductVariantForm[]>(
    initialData?.variants.map(v => ({
      id: v.id,
      name: v.name,
      sku: v.sku,
      price: v.price,
      inventory: v.inventory,
      options: v.options,
    })) || [{
      id: "",
      name: "",
      sku: "",
      price: 0,
      inventory: 0,
      options: {},
    }]
  )
  const [tags, setTags] = React.useState<string[]>(initialData?.tags || [""])
  const [dimensions, setDimensions] = React.useState(
    initialData?.dimensions || { length: 0, width: 0, height: 0 }
  )
  const [imageUrl, setImageUrl] = React.useState("")

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, Math.max(0, 10 - images.length))
    for (const file of files) {
      if (!file.type.startsWith("image/") || file.size > 1024 * 1024) continue
      const reader = new FileReader()
      reader.onload = (e) => {
        setImages((current) => current.length < 10 ? [...current, e.target?.result as string] : current)
      }
      reader.readAsDataURL(file)
    }
    e.target.value = ""
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const addImageUrl = () => {
    const url = imageUrl.trim()
    if (!url || images.length >= 10) return
    setImages((current) => [...current, url])
    setImageUrl("")
  }

  const addVariant = () => {
    setVariants(prev => [...prev, {
      id: "",
      name: "",
      sku: "",
      price: 0,
      inventory: 0,
      options: {},
    }])
  }

  const removeVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index))
  }

  const updateVariant = <K extends keyof ProductVariantForm>(
    index: number,
    field: K,
    value: ProductVariantForm[K]
  ) => {
    setVariants(prev => prev.map((v, i) => i === index ? { ...v, [field]: value } : v))
  }

  const addTag = () => setTags(prev => [...prev, ""])
  const removeTag = (index: number) => setTags(prev => prev.filter((_, i) => i !== index))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.append("images", JSON.stringify(images))
    formData.append("variants", JSON.stringify(variants))
    formData.append("tags", JSON.stringify(tags.filter(t => t)))
    formData.append("dimensions", JSON.stringify(dimensions))
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <section className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="font-medium text-neutral-900 mb-6">Basic Information</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">Product Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={initialData?.name || ""}
              required
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            />
          </div>
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-neutral-700 mb-2">Slug *</label>
            <input
              type="text"
              id="slug"
              name="slug"
              defaultValue={initialData?.slug || ""}
              required
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="shortDescription" className="block text-sm font-medium text-neutral-700 mb-2">Short Description *</label>
            <textarea
              id="shortDescription"
              name="shortDescription"
              defaultValue={initialData?.shortDescription || ""}
              required
              rows={3}
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">Full Description *</label>
            <textarea
              id="description"
              name="description"
              defaultValue={initialData?.description || ""}
              required
              rows={6}
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="font-medium text-neutral-900 mb-6">Pricing</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-neutral-700 mb-2">Price (GHS) *</label>
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"
              min="0"
              defaultValue={initialData?.price || 0}
              required
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            />
          </div>
          <div>
            <label htmlFor="compareAtPrice" className="block text-sm font-medium text-neutral-700 mb-2">Compare At Price (GHS)</label>
            <input
              type="number"
              id="compareAtPrice"
              name="compareAtPrice"
              step="0.01"
              min="0"
              defaultValue={initialData?.compareAtPrice || ""}
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            />
          </div>
          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-neutral-700 mb-2">SKU *</label>
            <input
              type="text"
              id="sku"
              name="sku"
              defaultValue={initialData?.sku || ""}
              required
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            />
          </div>
        </div>
      </section>

      {/* Category & Tags */}
      <section className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="font-medium text-neutral-900 mb-6">Category & Tags</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-neutral-700 mb-2">Category *</label>
            <select
              id="categoryId"
              name="categoryId"
              defaultValue={initialData?.categoryId || ""}
              required
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTags(prev => prev.map((t, i) => i === index ? e.target.value : t))}
                    className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    placeholder="Tag"
                  />
                  {tags.length > 1 && (
                    <button type="button" onClick={() => removeTag(index)} className="text-red-500 hover:text-red-700">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addTag} className="h-10 px-4 border border-neutral-300 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition-colors">
                <Plus className="h-4 w-4 mr-1" /> Add Tag
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Images */}
      <section className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="font-medium text-neutral-900 mb-6">Images</h2>
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <input
            type="text"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="Paste an image URL or /images/products/file.jpg"
            className="flex-1 h-11 rounded-lg border border-neutral-300 px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          />
          <button type="button" onClick={addImageUrl} className="btn-outline">Add image URL</button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-square overflow-hidden rounded-lg border border-neutral-200">
              <Image
                src={image}
                alt={`Product image ${index + 1}`}
                fill
                unoptimized
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-red-500/90 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <label className="relative aspect-square overflow-hidden rounded-lg border-2 border-dashed border-neutral-300 cursor-pointer hover:border-black transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <Upload className="h-8 w-8 text-neutral-400 mb-2" />
              <span className="text-sm text-neutral-600">Add Images</span>
              <span className="text-xs text-neutral-400">Max 10 images, 1 MB each</span>
            </div>
          </label>
        </div>
      </section>

      {/* Variants */}
      <section className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-medium text-neutral-900">Variants</h2>
          <button type="button" onClick={addVariant} className="btn-outline flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Variant
          </button>
        </div>
        <div className="space-y-4">
          {variants.map((variant, index) => (
            <div key={index} className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-neutral-900">Variant {index + 1}</h3>
                {variants.length > 1 && (
                  <button type="button" onClick={() => removeVariant(index)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={variant.name}
                    onChange={(e) => updateVariant(index, "name", e.target.value)}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    placeholder="e.g., Black / M"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">SKU *</label>
                  <input
                    type="text"
                    value={variant.sku}
                    onChange={(e) => updateVariant(index, "sku", e.target.value)}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    placeholder="e.g., EMD-BLK-M"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Price (GHS) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={variant.price}
                    onChange={(e) => updateVariant(index, "price", parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Inventory *</label>
                  <input
                    type="number"
                    min="0"
                    value={variant.inventory}
                    onChange={(e) => updateVariant(index, "inventory", parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Options (JSON)</label>
                  <textarea
                    value={JSON.stringify(variant.options, null, 2)}
                    onChange={(e) => {
                      try {
                        updateVariant(index, "options", JSON.parse(e.target.value))
                      } catch {}
                    }}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    placeholder='{"color": "Black", "size": "M"}'
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dimensions & Weight */}
      <section className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="font-medium text-neutral-900 mb-6">Dimensions & Weight</h2>
        <div className="grid gap-6 sm:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Weight (kg)</label>
            <input
              type="number"
              step="0.001"
              min="0"
              name="weight"
              defaultValue={initialData?.weight || ""}
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Length (cm)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              name="length"
              defaultValue={dimensions.length}
              onChange={(e) => setDimensions(prev => ({ ...prev, length: parseFloat(e.target.value) || 0 }))}
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Width (cm)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              name="width"
              defaultValue={dimensions.width}
              onChange={(e) => setDimensions(prev => ({ ...prev, width: parseFloat(e.target.value) || 0 }))}
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Height (cm)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              name="height"
              defaultValue={dimensions.height}
              onChange={(e) => setDimensions(prev => ({ ...prev, height: parseFloat(e.target.value) || 0 }))}
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            />
          </div>
        </div>
      </section>

      {/* Status */}
      <section className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="font-medium text-neutral-900 mb-6">Status</h2>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={initialData?.isActive !== false}
              className="h-4 w-4 rounded border-neutral-300 text-black focus-visible:ring-2 focus-visible:ring-black"
            />
            <span className="text-sm text-neutral-700">Active</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isFeatured"
              defaultChecked={initialData?.isFeatured === true}
              className="h-4 w-4 rounded border-neutral-300 text-black focus-visible:ring-2 focus-visible:ring-black"
            />
            <span className="text-sm text-neutral-700">Featured</span>
          </label>
        </div>
      </section>

      {/* Submit */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-neutral-200">
        <button type="button" onClick={() => router.back()} className="btn-outline">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? "Saving..." : initialData ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  )
}
