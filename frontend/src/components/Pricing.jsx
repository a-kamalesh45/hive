import {
    CreditCardIcon,
    CheckIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

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
            popular: false,
            gradient: "from-slate-700 to-slate-800"
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
            popular: true,
            gradient: "from-indigo-600 to-violet-600"
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
            popular: false,
            gradient: "from-violet-700 to-purple-700"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="mb-6">
                        <span className="inline-flex items-center px-4 py-2 bg-indigo-600 bg-opacity-20 border border-indigo-500 border-opacity-30 rounded-full text-indigo-400 text-sm font-medium">
                            <SparklesIcon className="w-4 h-4 mr-2" />
                            Simple, Transparent Pricing
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        Choose Your Plan
                    </h1>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto">
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
                                    <span className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                                        MOST POPULAR
                                    </span>
                                </div>
                            )}

                            <div
                                className={`h-full bg-slate-900 bg-opacity-50 backdrop-blur-md border ${plan.popular ? 'border-indigo-500 border-opacity-50' : 'border-slate-800'
                                    } rounded-2xl p-8 hover:border-slate-700 transition-all duration-300 ${plan.popular ? 'shadow-2xl shadow-indigo-500/20' : ''
                                    }`}
                            >
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                    <p className="text-slate-400 text-sm">{plan.description}</p>
                                </div>

                                <div className="mb-8">
                                    <div className="flex items-baseline">
                                        <span className="text-5xl font-bold text-white">${plan.price}</span>
                                        <span className="text-slate-400 ml-2">/month</span>
                                    </div>
                                </div>

                                <a
                                    href={plan.name === 'Enterprise' ? '#contact' : '#dashboard'}
                                    className={`block w-full py-3.5 px-6 text-center font-semibold rounded-xl transition-all duration-300 mb-8 ${plan.popular
                                            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transform hover:scale-105'
                                            : 'bg-slate-800 bg-opacity-50 hover:bg-opacity-70 text-white border border-slate-700 hover:border-slate-600'
                                        }`}
                                >
                                    {plan.cta}
                                </a>

                                <div className="space-y-4">
                                    <div className="text-sm font-semibold text-slate-300 mb-4">What's included:</div>
                                    {plan.features.map((feature, featureIdx) => (
                                        <div key={featureIdx} className="flex items-start">
                                            <CheckIcon className="w-5 h-5 text-indigo-400 mr-3 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-300 text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">
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
                                className="bg-slate-900 bg-opacity-50 backdrop-blur-md border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all duration-300"
                            >
                                <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                                <p className="text-slate-400">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
