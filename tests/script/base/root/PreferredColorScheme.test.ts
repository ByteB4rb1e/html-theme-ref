import { PreferredColorScheme } from '../../../../src/script/base/root';

beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
            matches: query === '(prefers-color-scheme: dark)', // Simulate dark mode if query matches
            media: query,
            onchange: null,
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        })),
    });
});

describe('PreferredColorScheme', () => {
    let colorScheme: PreferredColorScheme;

    beforeEach(() => {
        colorScheme = new PreferredColorScheme();
    });

    test('should initialize with system preference', () => {
        const initialScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        expect(colorScheme).toBeDefined();
        // Assert the applied scheme matches the system preference
        expect(
            document.documentElement.style.getPropertyValue(
                '--background-color'
            )
        ).toBe(
            getComputedStyle(document.documentElement).getPropertyValue(
                `--background-color-${initialScheme}`
            )
        );
    });

    test('should toggle the color scheme', () => {
        const initialScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const toggledScheme = initialScheme === 'dark' ? 'light' : 'dark';

        // Perform the toggle
        colorScheme.toggleScheme();

        // Assert the scheme was updated
        expect(
            document.documentElement.style.getPropertyValue(
                '--background-color'
            )
        ).toBe(
            getComputedStyle(document.documentElement).getPropertyValue(
                `--background-color-${toggledScheme}`
            )
        );
    });

    test('should log current scheme', () => {
        const consoleSpy = jest.spyOn(console, 'log');
        colorScheme.logCurrentScheme();
        expect(consoleSpy).toHaveBeenCalledWith(
            `Current color scheme: ${colorScheme['currentScheme']}`
        );
        consoleSpy.mockRestore();
    });
});
