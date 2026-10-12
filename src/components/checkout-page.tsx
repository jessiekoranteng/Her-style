"use client"

import * as React from "react"
import Link from "next/link"
import { useCartStore } from "@/lib/store"
import { ShoppingBag, Lock, ChevronRight, MapPin, Mail, Phone, CreditCard, Check, Loader2 } from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"

interface CheckoutFormData {
  // Shipping
  firstName: string
  lastName: string
  email: string
  phone: string
  addressLine1: string
  addressLine2: string
  city: string
  region: string
  postalCode: string
  // Payment
  paymentMethod: "paystack" | "card" | "mobile_money"
  cardName: string
  cardNumber: string
  cardExpiry: string
  cardCvc: string
}

const ghanaRegions = [
  "Greater Accra", "Ashanti", "Western", "Eastern", "Northern",
  "Volta", "Central", "Upper East", "Upper West", "Brong Ahafo"
]

export function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartStore()
  const subtotal = getSubtotal()
  const shipping = subtotal > 100000 ? 0 : 15000
  const total = subtotal + shipping
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const [currentStep, setCurrentStep] = React.useState(1)
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [formData, setFormData] = React.useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    region: "",
    postalCode: "",
    paymentMethod: "paystack",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  })
  const [errors, setErrors] = React.useState<Partial<CheckoutFormData>>({})

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateStep1 = () => {
    const newErrors: Partial<CheckoutFormData> = {}
    const requiredFields: (keyof CheckoutFormData)[] = [
      "firstName", "lastName", "email", "phone", "addressLine1", "city", "region"
    ]
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = "This field is required"
      }
    })
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }
    if (formData.phone && !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    if (formData.paymentMethod === "card") {
      const newErrors: Partial<CheckoutFormData> = {}
      if (!formData.cardName) newErrors.cardName = "This field is required"
      if (!formData.cardNumber) newErrors.cardNumber = "This field is required"
      if (!formData.cardExpiry) newErrors.cardExpiry = "This field is required"
      if (!formData.cardCvc) newErrors.cardCvc = "This field is required"
      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }
    return true
  }

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3)
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep2()) return

    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In production, integrate with Paystack here
    // const paymentResult = await processPaystackPayment(total, formData)
    
    clearCart()
    setIsProcessing(false)
    // Redirect to success page
    window.location.href = `/checkout/success?order=HS${Date.now()}`
  }

  const steps = [
    { number: 1, label: "Shipping", icon: MapPin },
    { number: 2, label: "Payment", icon: CreditCard },
    { number: 3, label: "Review", icon: Check },
  ]

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[30vh] min-h-[250px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200" />
        <div className="container-custom h-full flex items-center">
          <div className="max-w-2xl animate-slide-up">
            <p className="text-black/50 text-sm uppercase tracking-widest mb-4">CHECKOUT</p>
            <h1 className="font-display font-medium text-4xl sm:text-5xl mb-2">Checkout</h1>
            <p className="text-neutral-600 text-lg">{itemCount} {itemCount === 1 ? "item" : "items"} in your bag</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex items-center">
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center font-medium transition-all duration-300",
                      currentStep >= step.number
                        ? "bg-black text-white"
                        : "bg-neutral-200 text-neutral-500"
                    )}>
                      {currentStep > step.number ? <Check className="h-5 w-5" /> : step.number}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={cn(
                        "hidden lg:block w-20 h-1 mx-4",
                        currentStep > step.number ? "bg-black" : "bg-neutral-200"
                      )} />
                    )}
                  </div>
                  <span className={cn(
                    "hidden lg:block text-sm font-medium mt-2",
                    currentStep >= step.number ? "text-black" : "text-neutral-500"
                  )}>
                    {step.label}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-12">
            {/* Form Sections */}
            <div className="lg:col-span-2 space-y-8">
              {/* Step 1: Shipping */}
              {currentStep === 1 && (
                <fieldset className="space-y-6 animate-slide-up">
                  <legend className="font-medium text-neutral-900 mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Information
                  </legend>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        id="firstName"
                        value={formData.firstName}
                        onChange={e => handleInputChange("firstName", e.target.value)}
                        className={cn(
                          "w-full h-11 rounded-lg border bg-white px-4 text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black",
                          errors.firstName ? "border-red-500" : "border-neutral-300"
                        )}
                        required
                      />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        id="lastName"
                        value={formData.lastName}
                        onChange={e => handleInputChange("lastName", e.target.value)}
                        className={cn(
                          "w-full h-11 rounded-lg border bg-white px-4 text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black",
                          errors.lastName ? "border-red-500" : "border-neutral-300"
                        )}
                        required
                      />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={e => handleInputChange("email", e.target.value)}
                      className={cn(
                        "w-full h-11 rounded-lg border bg-white px-4 text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black",
                        errors.email ? "border-red-500" : "border-neutral-300"
                      )}
                      required
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={e => handleInputChange("phone", e.target.value)}
                      placeholder="+233 XX XXX XXXX"
                      className={cn(
                        "w-full h-11 rounded-lg border bg-white px-4 text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black",
                        errors.phone ? "border-red-500" : "border-neutral-300"
                      )}
                      required
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label htmlFor="addressLine1" className="block text-sm font-medium text-neutral-700 mb-2">Address Line 1 *</label>
                    <input
                      type="text"
                      id="addressLine1"
                      value={formData.addressLine1}
                      onChange={e => handleInputChange("addressLine1", e.target.value)}
                      placeholder="House number, street name"
                      className={cn(
                        "w-full h-11 rounded-lg border bg-white px-4 text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black",
                        errors.addressLine1 ? "border-red-500" : "border-neutral-300"
                      )}
                      required
                    />
                    {errors.addressLine1 && <p className="text-red-500 text-sm mt-1">{errors.addressLine1}</p>}
                  </div>
                  <div>
                    <label htmlFor="addressLine2" className="block text-sm font-medium text-neutral-700 mb-2">Address Line 2</label>
                    <input
                      type="text"
                      id="addressLine2"
                      value={formData.addressLine2}
                      onChange={e => handleInputChange("addressLine2", e.target.value)}
                      placeholder="Apartment, suite, landmark (optional)"
                      className="w-full h-11 rounded-lg border border-neutral-300 bg-white px-4 text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-2">City *</label>
                      <input
                        type="text"
                        id="city"
                        value={formData.city}
                        onChange={e => handleInputChange("city", e.target.value)}
                        className={cn(
                          "w-full h-11 rounded-lg border bg-white px-4 text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black",
                          errors.city ? "border-red-500" : "border-neutral-300"
                        )}
                        required
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label htmlFor="region" className="block text-sm font-medium text-neutral-700 mb-2">Region *</label>
                      <select
                        id="region"
                        value={formData.region}
                        onChange={e => handleInputChange("region", e.target.value)}
                        className={cn(
                          "w-full h-11 rounded-lg border bg-white px-4 text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black",
                          errors.region ? "border-red-500" : "border-neutral-300"
                        )}
                        required
                      >
                        <option value="">Select Region</option>
                        {ghanaRegions.map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                      {errors.region && <p className="text-red-500 text-sm mt-1">{errors.region}</p>}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-neutral-700 mb-2">Postal Code</label>
                    <input
                      type="text"
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={e => handleInputChange("postalCode", e.target.value)}
                      placeholder="e.g., GA-123-4567 (optional)"
                      className="w-full h-11 rounded-lg border border-neutral-300 bg-white px-4 text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    />
                  </div>
                </fieldset>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <fieldset className="space-y-6 animate-slide-up">
                  <legend className="font-medium text-neutral-900 mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </legend>
                  
                  <div className="space-y-3">
                    {["paystack", "card", "mobile_money"].map(method => (
                      <label key={method} className={cn(
                        "flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                        formData.paymentMethod === method
                          ? "border-black bg-neutral-50"
                          : "border-neutral-200 hover:border-neutral-300"
                      )}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={formData.paymentMethod === method}
                          onChange={e => handleInputChange("paymentMethod", e.target.value)}
                          className="h-4 w-4 text-black focus:ring-2 focus:ring-black"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {method === "paystack" && <Lock className="h-5 w-5 text-black" />}
                            {method === "card" && <CreditCard className="h-5 w-5 text-black" />}
                            {method === "mobile_money" && <Phone className="h-5 w-5 text-black" />}
                            <span className="font-medium text-neutral-900 capitalize">{method.replace("_", " ")}</span>
                          </div>
                          <p className="text-sm text-neutral-500 ml-7 mt-1">
                            {method === "paystack" && "Pay with Card, Mobile Money, or Bank Transfer via Paystack"}
                            {method === "card" && "Pay directly with Visa, Mastercard, or Verve"}
                            {method === "mobile_money" && "Pay with MTN MoMo, Vodafone Cash, or AirtelTigo Money"}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {formData.paymentMethod === "card" && (
                    <div className="space-y-6 border-t border-neutral-200 pt-6 animate-slide-up">
                      <div>
                        <label htmlFor="cardName" className="block text-sm font-medium text-neutral-700 mb-2">Name on Card *</label>
                        <input
                          type="text"
                          id="cardName"
                          value={formData.cardName}
                          onChange={e => handleInputChange("cardName", e.target.value)}
                          className={cn(
                            "w-full h-11 rounded-lg border bg-white px-4 text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black",
                            errors.cardName ? "border-red-500" : "border-neutral-300"
                          )}
                        />
                        {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
                      </div>
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-neutral-700 mb-2">Card Number *</label>
                        <input
                          type="text"
                          id="cardNumber"
                          value={formData.cardNumber}
                          onChange={e => handleInputChange("cardNumber", e.target.value.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim())}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className={cn(
                            "w-full h-11 rounded-lg border bg-white px-4 text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black font-mono",
                            errors.cardNumber ? "border-red-500" : "border-neutral-300"
                          )}
                        />
                        {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                      </div>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="cardExpiry" className="block text-sm font-medium text-neutral-700 mb-2">Expiry Date *</label>
                          <input
                            type="text"
                            id="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={e => {
                              let value = e.target.value.replace(/\D/g, "")
                              if (value.length >= 2) value = value.slice(0, 2) + "/" + value.slice(2, 4)
                              handleInputChange("cardExpiry", value)
                            }}
                            placeholder="MM/YY"
                            maxLength={5}
                            className={cn(
                              "w-full h-11 rounded-lg border bg-white px-4 text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black",
                              errors.cardExpiry ? "border-red-500" : "border-neutral-300"
                            )}
                          />
                          {errors.cardExpiry && <p className="text-red-500 text-sm mt-1">{errors.cardExpiry}</p>}
                        </div>
                        <div>
                          <label htmlFor="cardCvc" className="block text-sm font-medium text-neutral-700 mb-2">CVC *</label>
                          <input
                            type="text"
                            id="cardCvc"
                            value={formData.cardCvc}
                            onChange={e => handleInputChange("cardCvc", e.target.value.replace(/\D/g, "").slice(0, 4))}
                            placeholder="123"
                            maxLength={4}
                            className={cn(
                              "w-full h-11 rounded-lg border bg-white px-4 text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black",
                              errors.cardCvc ? "border-red-500" : "border-neutral-300"
                            )}
                          />
                          {errors.cardCvc && <p className="text-red-500 text-sm mt-1">{errors.cardCvc}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === "mobile_money" && (
                    <div className="border-t border-neutral-200 pt-6 animate-slide-up">
                      <p className="text-neutral-600 mb-4">
                        You will receive a prompt on your phone to authorize the payment after placing your order.
                      </p>
                      <div className="grid sm:grid-cols-3 gap-4">
                        {["MTN MoMo", "Vodafone Cash", "AirtelTigo Money"].map(provider => (
                          <label key={provider} className="flex items-center justify-center gap-2 p-4 border border-neutral-200 rounded-lg cursor-pointer hover:border-neutral-300 transition-colors">
                            <input type="radio" name="mobileProvider" className="h-4 w-4 text-black" />
                            <span className="text-sm font-medium text-neutral-900">{provider}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </fieldset>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <fieldset className="space-y-6 animate-slide-up">
                  <legend className="font-medium text-neutral-900 mb-4 flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    Review Your Order
                  </legend>
                  
                  <div className="bg-neutral-50 rounded-lg p-6 space-y-4">
                    <h3 className="font-medium text-neutral-900">Shipping Address</h3>
                    <address className="text-neutral-600 not-italic leading-relaxed">
                      {formData.firstName} {formData.lastName}<br />
                      {formData.addressLine1}<br />
                      {formData.addressLine2 && `${formData.addressLine2}<br />`}
                      {formData.city}, {formData.region}<br />
                      {formData.postalCode && `${formData.postalCode}<br />`}
                      Ghana<br />
                      {formData.email}<br />
                      {formData.phone}
                    </address>
                  </div>

                  <div className="bg-neutral-50 rounded-lg p-6 space-y-4">
                    <h3 className="font-medium text-neutral-900">Payment Method</h3>
                    <div className="text-neutral-600">
                      {formData.paymentMethod === "paystack" && "Paystack (Card, Mobile Money, Bank Transfer)"}
                      {formData.paymentMethod === "card" && `Card ending in ${formData.cardNumber.slice(-4)}`}
                      {formData.paymentMethod === "mobile_money" && "Mobile Money"}
                    </div>
                  </div>

                  <div className="bg-neutral-50 rounded-lg p-6">
                    <h3 className="font-medium text-neutral-900 mb-4">Order Items</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {items.map(item => (
                        <div key={item.id} className="flex items-center gap-4 py-2 border-b border-neutral-200 last:border-0">
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                            {item.product.images[0] ? (
                              <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full bg-neutral-200" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-neutral-900 truncate">{item.product.name}</p>
                            {item.variant && <p className="text-sm text-neutral-500">{item.variant.name}</p>}
                            <p className="text-sm text-neutral-600">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-semibold text-neutral-900">GHS {(item.variant?.price || item.product.price) * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </fieldset>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4 -rotate-90 mr-2" />
                  Back
                </button>
                <div className="flex gap-4">
                  {currentStep < 3 && (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn-primary"
                    >
                      Continue
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </button>
                  )}
                  {currentStep === 3 && (
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="btn-primary"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        `Place Order - GHS ${total.toLocaleString()}`
                      )}
                    </button>
                  )}
                </div>
              </div>

              <p className="text-center text-xs text-neutral-500">
                <Lock className="h-4 w-4 inline mr-1" />
                Secure checkout powered by Paystack. Your payment information is encrypted and secure.
              </p>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-neutral-50 rounded-lg p-6">
                <h2 className="font-medium text-neutral-900 mb-6 flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Order Summary
                </h2>
                
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-2">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                        {item.product.images[0] ? (
                          <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full bg-neutral-200" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${item.product.slug}`} className="font-medium text-sm text-neutral-900 hover:text-black truncate block">
                          {item.product.name}
                        </Link>
                        {item.variant && <p className="text-xs text-neutral-500">{item.variant.name}</p>}
                        <p className="text-sm text-neutral-900">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-neutral-900 whitespace-nowrap">
                        GHS {(item.variant?.price || item.product.price) * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-neutral-200 pt-4">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                    <span className="font-medium text-neutral-900">GHS {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Shipping</span>
                    <span className="font-medium text-neutral-900">
                      {shipping === 0 ? (
                        <span className="text-emerald-600">Free</span>
                      ) : (
                        `GHS ${shipping.toLocaleString()}`
                      )}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-neutral-500">
                      Free shipping on orders over GHS 100,000
                    </p>
                  )}
                  <div className="flex justify-between text-base font-semibold text-neutral-900 border-t border-neutral-200 pt-3">
                    <span>Total</span>
                    <span>GHS {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}