import { useEffect, useState } from "react"
import { X } from "lucide-react"
// import Link from "next/link"

export default function PopupOfferModal() {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true)
    }, 10)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => setShowModal(false)

  if (!showModal) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm  flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden relative animate-fade-in max-h-[90vh]">
        {/* Close Button */}
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10">
          <X size={20} />
        </button>

        <div className="flex flex-col">
          {/* Content Side */}
          <div className="p-8 flex-1 flex flex-col justify-center text-center">
            <h2 className="text-2xl font-bold text-slate-600 mb-3 leading-tight">
              Get a $50 Mastercard
              <br />
              Gift Card
            </h2>

            <p className="text-gray-600 text-sm mb-5">
              Get a $50 Mastercard Gift Card after visiting the dentist
              <br />
              when you book with Opencare!
            </p>

            <div className="text-xs text-gray-500 mb-5">
              By activating your offer you are agreeing to our{" "}
              <a href="/privacy" className="text-[#5098f0]">
                Privacy Policy
              </a>
            </div>

            <input
              type="email"
              placeholder="Enter your email to apply"
              className="w-full p-3 mb-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5098f0] text-sm"
            />

            <button className="w-full bg-[#5098f0] text-white py-3 rounded-full hover:bg-[#4a6a90] transition font-medium text-sm">
              Apply Offer
            </button>

            <button onClick={handleClose} className="mt-3 text-xs text-gray-500 hover:text-gray-700">
              I do not want this offer
            </button>
          </div>

          {/* Image Bottom */}
          <div className="w-full h-64">
            <img
              src="/assets/smile-image1.jpg"
              alt="Person smiling"
              className="object-cover h-full w-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
