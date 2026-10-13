import { Metadata } from "next"
import { MapPin, Mail, Phone, Clock, Send } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with HerStyle. We're here to help with any questions about our products, orders, or services.",
}

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200" />
        <div className="container-custom h-full flex items-center">
          <div className="max-w-2xl animate-slide-up text-center mx-auto">
            <p className="text-black/50 text-sm uppercase tracking-widest mb-4">GET IN TOUCH</p>
            <h1 className="font-display font-medium text-4xl sm:text-5xl mb-6">Contact Us</h1>
            <p className="text-neutral-600 text-lg">
              Have a question? We&apos;d love to hear from you. Our team is here to help.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="font-display font-medium text-2xl mb-6">Get in Touch</h2>
                <p className="text-neutral-600 leading-relaxed mb-8">
                  Whether you have a question about our products, need help with an order, or just want to say hello, we&apos;re here for you.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">Visit Us</h3>
                    <p className="text-neutral-600">123 Oxford Street, Accra, Ghana</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">Email Us</h3>
                    <p className="text-neutral-600">hello@herstyle.com</p>
                    <p className="text-neutral-600">support@herstyle.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">Call Us</h3>
                    <p className="text-neutral-600">+233 20 123 4567</p>
                    <p className="text-neutral-600">+233 30 789 0123</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">Business Hours</h3>
                    <p className="text-neutral-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-neutral-600">Saturday: 10:00 AM - 4:00 PM</p>
                    <p className="text-neutral-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="border-t border-neutral-200 pt-8">
                <h3 className="font-medium text-neutral-900 mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors" aria-label="Instagram">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors" aria-label="Facebook">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors" aria-label="Twitter">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-neutral-50 rounded-lg p-8">
                <h2 className="font-display font-medium text-2xl mb-6">Send Us a Message</h2>
                <form className="space-y-6" id="contact-form">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-2">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        className="w-full h-11 rounded-lg border border-neutral-300 bg-white px-4 text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        className="w-full h-11 rounded-lg border border-neutral-300 bg-white px-4 text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full h-11 rounded-lg border border-neutral-300 bg-white px-4 text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full h-11 rounded-lg border border-neutral-300 bg-white px-4 text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-2">Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      className="w-full h-11 rounded-lg border border-neutral-300 bg-white px-4 text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Support</option>
                      <option value="product">Product Question</option>
                      <option value="shipping">Shipping & Delivery</option>
                      <option value="returns">Returns & Exchanges</option>
                      <option value="wholesale">Wholesale Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black resize-none"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="btn-primary w-full sm:w-auto py-3 px-8"
                    id="submit-btn"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <p className="text-black/50 text-sm uppercase tracking-widest mb-4">FREQUENTLY ASKED</p>
            <h2 className="font-display font-medium text-3xl sm:text-4xl">Common Questions</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <details className="group bg-white rounded-lg p-6">
              <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-neutral-900">
                How long does shipping take?
                <svg className="h-5 w-5 text-neutral-500 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
              </summary>
              <p className="mt-4 text-neutral-600 leading-relaxed">We offer fast delivery within 2-5 business days for Accra and 3-7 business days for other regions in Ghana. You’ll receive tracking information once your order ships.</p>
            </details>
            <details className="group bg-white rounded-lg p-6">
              <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-neutral-900">
                What is your return policy?
                <svg className="h-5 w-5 text-neutral-500 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
              </summary>
              <p className="mt-4 text-neutral-600 leading-relaxed">We offer a 30-day hassle-free return policy. Items must be unworn, unwashed, and in original packaging with tags attached. Contact our support team to initiate a return.</p>
            </details>
            <details className="group bg-white rounded-lg p-6">
              <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-neutral-900">
                What payment methods do you accept?
                <svg className="h-5 w-5 text-neutral-500 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
              </summary>
              <p className="mt-4 text-neutral-600 leading-relaxed">We accept Visa, Mastercard, Paystack, Apple Pay, Google Pay, and mobile money payments. All transactions are securely processed.</p>
            </details>
            <details className="group bg-white rounded-lg p-6">
              <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-neutral-900">
                Do you offer international shipping?
                <svg className="h-5 w-5 text-neutral-500 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
              </summary>
              <p className="mt-4 text-neutral-600 leading-relaxed">Currently we ship within Ghana only. We’re working on expanding to international destinations soon. Sign up for our newsletter to stay updated!</p>
            </details>
            <details className="group bg-white rounded-lg p-6">
              <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-neutral-900">
                How can I track my order?
                <svg className="h-5 w-5 text-neutral-500 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
              </summary>
              <p className="mt-4 text-neutral-600 leading-relaxed">Once your order ships, you’ll receive an email with tracking details. You can also track your order by logging into your account and visiting the Orders section.</p>
            </details>
            <details className="group bg-white rounded-lg p-6">
              <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-neutral-900">
                Can I modify or cancel my order?
                <svg className="h-5 w-5 text-neutral-500 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
              </summary>
              <p className="mt-4 text-neutral-600 leading-relaxed">We process orders quickly. If you need to modify or cancel, please contact us immediately at support@herstyle.com. We’ll do our best to accommodate if the order hasn’t shipped yet.</p>
            </details>
          </div>
        </div>
      </section>
    </div>
  )
}
