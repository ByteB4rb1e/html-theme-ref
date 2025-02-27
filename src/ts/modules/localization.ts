
interface Window {
  air_light_screenReaderText: { [key: string]: string };
}

// Ensure this declaration is picked up by TypeScript
declare var window: Window;

export default function getLocalization(stringKey: string): string {
  if (typeof window.air_light_screenReaderText === 'undefined' || typeof window.air_light_screenReaderText[stringKey] === 'undefined') {
    // eslint-disable-next-line no-console
    console.error('Missing translation for ' + stringKey);
    return '';
  }
  return window.air_light_screenReaderText[stringKey];
}
