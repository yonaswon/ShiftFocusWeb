"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/api";

const PaymentScreen = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>("yearly");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const plans = [
    {
      id: "monthly",
      name: "Monthly",
      price: "$9.99",
      per: "month",
      savings: "",
      popular: false,
      sub_type:'month'

    },
    {
      id: "quarterly",
      name: "Quarterly",
      price: "$18.99",
      per: "3 months",
      savings: "Save 37%",
      popular: false,
      sub_type:'year'
    },
    {
      id: "yearly",
      name: "Yearly",
      price: "$49.99",
      per: "year",
      savings: "Save 58%",
      popular: true,
      sub_type:'3month'

    },
  ];

const handlePayment = async () => {
  try {
    setLoading(true);

    const selectedPlanData = plans.find((p) => p.id === selectedPlan);

    if (!selectedPlanData) {
      throw new Error("Selected plan not found");
    }

    const result = await api.post('/payment/create-checkout-session/', {
      sub_type: selectedPlanData.sub_type, // Send the correct subscription type
    });

    // Redirect to Stripe checkout or any external URL
    if (result?.data?.url) {
      window.location.href = result.data.url;
    } else {
      throw new Error("Invalid payment URL");
    }
  } catch (error) {
    console.error("Payment error:", error);
    alert("Something went wrong. Please try again.");
    setLoading(false); // Ensure loading is turned off
  }
};


  return (
    <div className=" bg-[url('/bg.jpg')]  bg-cover bg-cente w-full h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full max-h-[90vh] overflow-y-auto backdrop-blur-sm bg-black/30 rounded-xl shadow-2xl p-6 border border-gray-700/50">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-1 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400">
            Invest in Yourself
          </h1>
          <p className="text-white/80 text-sm text-center">
            ShiftFocus will distract you when the urge hits
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                selectedPlan === plan.id
                  ? "bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-blue-400/50 shadow-md"
                  : "bg-gray-800/40 border-gray-600/30 hover:bg-gray-700/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                  POPULAR
                </div>
              )}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-white text-sm font-medium">
                    {plan.name}
                  </h3>
                  {plan.savings && (
                    <span className="text-xs text-green-400">
                      {plan.savings}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-lg">{plan.price}</p>
                  <p className="text-white/60 text-xs">{plan.per}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-800/40 rounded-lg p-3 mb-4">
          <div className="flex justify-between text-white/80 text-xs mb-1">
            <span>Selected Plan</span>
            <span>{plans.find((p) => p.id === selectedPlan)?.name}</span>
          </div>
          <div className="flex justify-between text-white text-sm">
            <span>Total Due Today</span>
            <span className="font-medium">
              {plans.find((p) => p.id === selectedPlan)?.price}
            </span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full py-2.5 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transition-all ${
            loading
              ? "opacity-70 cursor-not-allowed"
              : "hover:from-blue-500 hover:to-purple-500 hover:shadow-xl"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-4 w-4 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </div>
          ) : (
            "Continue to Payment"
          )}
        </button>

        <div className="mt-3 text-center text-xs text-white/50">
          Secure payment processing. Cancel anytime.
        </div>
      </div>
    </div>
  );
};

export default PaymentScreen;
