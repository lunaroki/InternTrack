const base =
'w-full rounded-lg border bg-surface px-3 text-sm text-ink placeholder:text-ink-subtle/80 transition-[border-color,box-shadow] duration-150 focus:outline-none focus:ring-4';

const tone = (hasError: boolean) =>
hasError ?
'border-danger focus:border-danger focus:ring-danger/15' :
'border-line-strong focus:border-brand-500 focus:ring-brand-100';

export function inputClass(hasError = false): string {
  return `${base} h-10 ${tone(hasError)}`;
}

export function textareaClass(hasError = false): string {
  return `${base} min-h-[96px] py-2.5 leading-relaxed resize-y ${tone(hasError)}`;
}

export function selectClass(hasError = false): string {
  return `${base} h-10 appearance-none pr-9 cursor-pointer ${tone(hasError)}`;
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;