import React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { selectClass } from '../../utils/formStyles';

interface SelectInputProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  hasError?: boolean;
  wrapperClassName?: string;
}

export function SelectInput({ hasError = false, wrapperClassName = '', children, ...props }: SelectInputProps) {
  return (
    <div className={`relative ${wrapperClassName}`}>
      <select {...props} className={selectClass(hasError)}>
        {children}
      </select>
      <ChevronDownIcon
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle"
        aria-hidden="true" />
      
    </div>);

}