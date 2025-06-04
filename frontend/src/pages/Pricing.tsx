import PricingPlans from "@/components/PricingPlans"

function Pricing() {
  return (
    <div className="py-10">
      <div className="mb-20 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Choose Your Plan</h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Try Free and enjoy basic features. Want more? Upgrade to Pro for unlimited listings, private circles, and exclusive perks.
        </p>

      </div>

      <PricingPlans />
    </div>
  )
}

export default Pricing