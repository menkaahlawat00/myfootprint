'use client';

import { useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { QuestionZip } from '@/components/onboarding/question-zip';
import { QuestionHousing } from '@/components/onboarding/question-housing';
import { QuestionHousehold } from '@/components/onboarding/question-household';
import { QuestionCommute } from '@/components/onboarding/question-commute';
import { QuestionDiet } from '@/components/onboarding/question-diet';
import { QuestionShopping } from '@/components/onboarding/question-shopping';
import { ResultsReveal } from '@/components/onboarding/results-reveal';

export default function OnboardingPage() {
  const step = useOnboardingStore((s) => s.step);
  const setStep = useOnboardingStore((s) => s.setStep);

  // Initialize to step 1 when arriving at /onboarding
  useEffect(() => {
    if (step === 0) {
      setStep(1);
    }
  }, [step, setStep]);

  return (
    <div className="flex flex-1 flex-col">
      <AnimatePresence mode="wait">
        {step === 1 && <QuestionZip key="zip" />}
        {step === 2 && <QuestionHousing key="housing" />}
        {step === 3 && <QuestionHousehold key="household" />}
        {step === 4 && <QuestionCommute key="commute" />}
        {step === 5 && <QuestionDiet key="diet" />}
        {step === 6 && <QuestionShopping key="shopping" />}
        {step === 7 && <ResultsReveal key="results" />}
      </AnimatePresence>
    </div>
  );
}
