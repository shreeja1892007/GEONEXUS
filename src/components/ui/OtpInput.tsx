import React, { useRef, useEffect } from 'react';

interface OtpInputProps {
  value: string;
  onChange: (otp: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  autoFocus?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  disabled = false,
  hasError = false,
  autoFocus = true,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = Array.from({ length: 6 }, (_, i) => value[i] || '');

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) return;

    const newDigits = [...digits];

    // If pasted or multiple digits entered
    if (val.length > 1) {
      const pasted = val.slice(0, 6);
      onChange(pasted);
      const nextIndex = Math.min(pasted.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    newDigits[index] = val.slice(-1);
    const combined = newDigits.join('');
    onChange(combined);

    // Auto-focus next
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newDigits = [...digits];

      if (newDigits[index]) {
        // Clear current box
        newDigits[index] = '';
        onChange(newDigits.join(''));
      } else if (index > 0) {
        // Move back and clear previous box
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      onChange(pastedData);
      const targetIndex = Math.min(pastedData.length, 5);
      inputRefs.current[targetIndex]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 my-2" role="group" aria-label="6-digit verification code">
      {Array.from({ length: 6 }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digits[index]}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          aria-label={`Digit ${index + 1} of 6`}
          className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-xl border transition-all duration-150 select-all ${
            hasError
              ? 'border-[#C53A3A] bg-red-50/20 text-[#C53A3A] ring-1 ring-[#C53A3A]/20'
              : digits[index]
              ? 'border-[#246BCE] bg-blue-50/20 text-navy font-semibold ring-1 ring-[#246BCE]/20'
              : 'border-slate-300 bg-white hover:border-slate-400 focus:border-[#246BCE] focus:ring-2 focus:ring-[#246BCE]/20 text-[#1D2733]'
          } disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 focus:outline-none`}
        />
      ))}
    </div>
  );
};

