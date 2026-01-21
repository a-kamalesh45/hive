import {
    CreditCardIcon,
    CheckIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import beePng from '../assets/bee.png';

const Pricing = () => {
    const plans = [
        {
            name: "Starter",
            price: "29",
            description: "Perfect for small teams getting started",
            features: [
                "Up to 1,000 queries/month",
                "3 team members",
                "Basic analytics",
                "Email support",
                "7-day response SLA",
                "Mobile app access"
            ],
            cta: "Start Free Trial",
            popular: false
        },
        {
            name: "Professional",
            price: "99",
            description: "For growing teams with advanced needs",
            features: [
                "Up to 10,000 queries/month",
                "15 team members",
                "Advanced analytics & reports",
                "Priority email & chat support",
                "24-hour response SLA",
                "Custom integrations",
                "API access",
                "Custom workflows"
            ],
            cta: "Start Free Trial",
            popular: true
        },
        {
            name: "Enterprise",
            price: "299",
            description: "For large organizations at scale",
            features: [
                "Unlimited queries",
                "Unlimited team members",
                "Enterprise analytics suite",
                "24/7 dedicated support",
                "1-hour response SLA",
                "Custom integrations",
                "API access",
                "Advanced security features",
                "SSO & SAML",
                "Dedicated account manager"
            ],
            cta: "Contact Sales",
            popular: false
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] via-white to-[#FFF9F0] py-20 px-4 relative overflow-hidden">
            {/* Hexagon Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='52' viewBox='0 0 60 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='%23F59E0B' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                backgroundSize: '60px 52px'
            }} />
            <img src={beePng} alt="" className="absolute top-20 right-10 w-40 h-40 opacity-[0.02] pointer-events-none" />
            <img src={beePng} alt="" className="absolute bottom-20 left-10 w-32 h-32 opacity-[0.02] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="mb-6">
                        <span className="inline-flex items-center px-4 py-2 bg-amber-100 border-2 border-amber-300 rounded-full text-amber-800 text-sm font-semibold shadow-md">
                            <SparklesIcon className="w-4 h-4 mr-2" />
                            Simple, Transparent Pricing
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Choose Your Plan
                    </h1>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                        Start with a 14-day free trial. No credit card required. Cancel anytime.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={`relative ${plan.popular ? 'lg:-mt-4 lg:mb-4' : ''
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-5 left-0 right-0 flex justify-center">
                                    <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                                        MOST POPULAR 🐝
                                    </span>
                                </div>
                            )}

                            <div
                                className={`h-full bg-white/90 backdrop-blur-md border-2 ${plan.popular ? 'border-amber-400' : 'border-amber-200'
                                    } rounded-2xl p-8 hover:border-amber-300 transition-all duration-300 ${plan.popular ? 'shadow-2xl shadow-amber-500/20' : 'shadow-lg'
                                    }`}
                            >
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                    <p className="text-gray-600 text-sm">{plan.description}</p>
                                </div>

                                <div className="mb-8">
                                    <div className="flex items-baseline">
                                        <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                                        <span className="text-gray-600 ml-2">/month</span>
                                    </div>
                                </div>

                                <a
                                    href={plan.name === 'Enterprise' ? '#contact' : '#dashboard'}
                                    className={`block w-full py-3.5 px-6 text-center font-semibold rounded-xl transition-all duration-300 mb-8 ${plan.popular
                                            ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transform hover:scale-105'
                                            : 'bg-white hover:bg-amber-50 text-amber-700 border-2 border-amber-300 hover:border-amber-400'
                                        }`}
                                >
                                    {plan.cta}
                                </a>

                                <div className="space-y-4">
                                    <div className="text-sm font-semibold text-gray-900 mb-4">What's included:</div>
                                    {plan.features.map((feature, featureIdx) => (
                                        <div key={featureIdx} className="flex items-start">
                                            <CheckIcon className="w-5 h-5 text-amber-600 mr-3 shrink-0 mt-0.5" />
                                            <span className="text-gray-700 text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-6">
                        {[
                            {
                                q: "Can I change plans later?",
                                a: "Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
                            },
                            {
                                q: "What payment methods do you accept?",
                                a: "We accept all major credit cards (Visa, MasterCard, American Express) and PayPal for monthly subscriptions."
                            },
                            {
                                q: "Is there a setup fee?",
                                a: "No, there are no setup fees or hidden charges. You only pay the monthly subscription fee."
                            },
                            {
                                q: "Can I cancel my subscription?",
                                a: "Yes, you can cancel your subscription at any time. Your account will remain active until the end of the billing period."
                            }
                        ].map((faq, idx) => (
                            <div
                                key={idx}
                                className="bg-white/90 backdrop-blur-md border-2 border-amber-200 rounded-xl p-6 hover:border-amber-300 transition-all duration-300 shadow-md"
                            >
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h3>
                                <p className="text-gray-700">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;