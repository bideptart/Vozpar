import React from 'react';
import { RippleButton } from "@/components/ui/multi-type-ripple-buttons";

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="3"
    strokeLinecap="round" strokeLinejoin="round"
    className={className}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export interface PricingCardProps {
  planName: string;
  description: string;
  price: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  buttonVariant?: 'primary' | 'secondary';
}

export const PricingCard = ({
  planName, description, price, features, buttonText, isPopular = false, buttonVariant = 'primary'
}: PricingCardProps) => {
  const cardClasses = `
    backdrop-blur-[14px] bg-gradient-to-br rounded-2xl shadow-xl flex-1 w-full max-w-[260px] px-5 py-6 flex flex-col transition-all duration-300
    from-black/5 to-black/0 border border-black/10
    dark:from-white/10 dark:to-white/5 dark:border-white/10 dark:backdrop-brightness-[0.91]
    ${isPopular ? 'scale-[1.03] relative ring-2 ring-cyan-400/20 dark:from-white/20 dark:to-white/10 dark:border-cyan-400/30 shadow-2xl' : ''}
  `;
  const buttonClasses = `
    mt-auto w-full py-2 rounded-xl font-semibold text-[13px] transition font-sans
    ${buttonVariant === 'primary'
      ? 'bg-cyan-400 hover:bg-cyan-300 text-foreground'
      : 'bg-black/10 hover:bg-black/20 text-foreground border border-black/20 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border-white/20'
    }
  `;

  return (
    <div className={cardClasses.trim()}>
      {isPopular && (
        <div className="absolute -top-3 right-3 px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-cyan-400 text-foreground dark:text-black">
          Most Popular
        </div>
      )}
      <div className="mb-2">
        <h2 className="text-[34px] font-extralight tracking-[-0.03em] text-foreground font-display leading-tight">{planName}</h2>
        <p className="text-[13px] text-foreground/70 mt-1 font-sans leading-snug">{description}</p>
      </div>
      <div className="my-4 flex items-baseline gap-1.5">
        <span className="text-[36px] font-extralight text-foreground font-display leading-none">${price}</span>
        <span className="text-[13px] text-foreground/70 font-sans">/mo</span>
      </div>
      <div className="card-divider w-full mb-4 h-px bg-[linear-gradient(90deg,transparent,rgba(0,0,0,0.1)_50%,transparent)] dark:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.09)_20%,rgba(255,255,255,0.22)_50%,rgba(255,255,255,0.09)_80%,transparent)]"></div>
      <ul className="flex flex-col gap-1.5 text-[13px] text-foreground/90 mb-5 font-sans">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <CheckIcon className="text-cyan-400 w-3.5 h-3.5 shrink-0" /> {feature}
          </li>
        ))}
      </ul>
      <RippleButton className={buttonClasses.trim()}>{buttonText}</RippleButton>
    </div>
  );
};

interface ModernPricingPageProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  plans: PricingCardProps[];
}

export const ModernPricingPage = ({
  title,
  subtitle,
  plans,
}: ModernPricingPageProps) => {
  return (
    <div className="bg-background text-foreground w-full overflow-x-hidden">
      <main className="relative w-full flex flex-col items-center justify-center px-4 py-16 md:py-24">
        <div className="w-full max-w-5xl mx-auto text-center mb-14">
          <h1 className="text-[40px] md:text-[64px] font-extralight leading-tight tracking-[-0.03em] bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-cyan-500 to-blue-600 dark:from-white dark:via-cyan-300 dark:to-blue-400 font-display">
            {title}
          </h1>
          <p className="mt-3 text-[16px] md:text-[20px] text-foreground/80 max-w-2xl mx-auto font-sans">
            {subtitle}
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-8 md:gap-6 justify-center items-center md:items-stretch w-full max-w-4xl">
          {plans.map((plan) => <PricingCard key={plan.planName} {...plan} />)}
        </div>
      </main>
    </div>
  );
};
