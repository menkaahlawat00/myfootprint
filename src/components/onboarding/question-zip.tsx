'use client';

import { useState } from 'react';
import { m } from 'motion/react';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { Button } from '@/components/ui/button';

const slideVariants = {
  enter: { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

function QuestionZip() {
  const answers = useOnboardingStore((s) => s.answers);
  const setAnswer = useOnboardingStore((s) => s.setAnswer);
  const setStep = useOnboardingStore((s) => s.setStep);

  const [zipCode, setZipCode] = useState(answers.zipCode ?? '');
  const [error, setError] = useState('');

  const isValid = /^\d{5}$/.test(zipCode);

  const handleSubmit = () => {
    if (!isValid) {
      setError('Please enter a valid 5-digit zip code');
      return;
    }
    setError('');
    setAnswer('zipCode', zipCode);
    setTimeout(() => setStep(2), 300);
  };

  const handleSkip = () => {
    setStep(2);
  };

  const handleChange = (value: string) => {
    // Only allow digits, max 5
    const cleaned = value.replace(/\D/g, '').slice(0, 5);
    setZipCode(cleaned);
    if (error) setError('');
  };

  return (
    <m.div
      className="flex flex-1 flex-col"
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Question header */}
      <div className="mb-8">
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-text-muted">
          Question 1 of 6
        </p>
        <h2 className="font-display text-3xl font-bold leading-tight text-primary">
          Where do you live?
        </h2>
        <p className="mt-2 text-base text-text-muted">
          Your zip code helps us estimate your regional energy mix and climate impact.
        </p>
      </div>

      {/* Input */}
      <div className="mb-6">
        <label htmlFor="zip-input" className="sr-only">
          Zip code
        </label>
        <input
          id="zip-input"
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="e.g. 90210"
          value={zipCode}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
          className={`w-full rounded-lg border-2 bg-surface px-5 py-4 font-mono text-2xl tracking-widest text-primary outline-none transition-colors placeholder:text-text-muted/40 ${
            error
              ? 'border-negative'
              : zipCode.length === 5
                ? 'border-accent'
                : 'border-border focus:border-accent'
          }`}
        />
        {error && (
          <p className="mt-2 text-sm text-negative" role="alert">
            {error}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="mt-auto flex flex-col gap-3">
        <Button
          onClick={handleSubmit}
          disabled={!isValid}
          size="lg"
          className="w-full rounded-lg"
        >
          Continue
        </Button>
        <button
          onClick={handleSkip}
          className="py-2 text-sm text-text-muted transition-colors hover:text-primary"
        >
          Skip for now
        </button>
      </div>
    </m.div>
  );
}

export { QuestionZip };
