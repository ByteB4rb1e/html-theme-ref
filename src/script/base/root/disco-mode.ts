import { ColorScheme, PreferredColorScheme } from './preferred-color-scheme';
import { pixabay, gifercom } from '../../vendors';

enum DiscoBallState {
    Lowered,
    Raised,
    InBetween
}

enum DiscoModeState {
    Enabled,
    Disabled,
    InBetween
}

/**
 * Tests if the browser allows audio autoplay by attempting to play
 * a muted audio file.
 *
 * @returns A promise resolving to `true` if autoplay is allowed, otherwise
 *          `false`.
 */
async function canPlayAudio() {
    // TODO: fix waveform issue, should be a single sample at a very low bitrate
    // and an amplitude of 0.
    const audio = new Audio(
        'data:audio/x-wav;base64,UklGRooWAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YWYWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
    );
    audio.muted = true;

    try {
        await audio.play();
        console.log('disco-mode [serious]: audio autoplay is allowed');
        return true;
    } catch (error) {
        console.warn('disco-mode [serious]: audio autoplay is blocked:', error);
        return false;
    }
}

async function waitForAudioEvent(
    event: string,
    audio: HTMLAudioElement
): Promise<void> {
    return new Promise((resolve, reject) => {
        const listener = () => {
            audio.removeEventListener(event, listener);
            resolve();
        }

        audio.addEventListener(event, listener);
    });
}

/**
 * Type Guard for writable properties of an HTMLElement for setting CSS
 * attributes 
 */
type WritableCSSProperty = Exclude<keyof CSSStyleDeclaration, 'length'>;

/**
 * Linearly animates a CSS attribute of a DOM element.
 *
 * On a side note: For over a decade, the one thing I've always remembered
 * about easing is "Penner Easing." A quick web search, and there he is. Huge
 * thanks to Robert Penner! His website hasn't changed much over the years, but
 * the simplicity of his approach to easing has stood the test of time.
 * It's just math, and Penner made it obvious to me. Thank you, Robert Penner!
 *
 * TODO: Refactor to allow integration of Robert Penner's easing functions.
 *
 * @param attributeName - The CSS attribute to animate (e.g., 'opacity', 'width').
 * @param element - The HTML element whose attribute will be animated.
 * @param duration - The total duration of the animation in milliseconds.
 * @param start - The starting value of the attribute.
 * @param end - The ending value of the attribute.
 * @param unit - The unit of the attribute value (e.g., 'px', '%').
 * @param interval - Optional. The interval between animation steps in milliseconds (defaults to 10ms).
 * @returns A promise that resolves once the animation completes.
 */
async function animateAttributeLinear(
    attributeName: keyof WritableCSSProperty,
    element: HTMLElement,
    duration: number,
    start: number,
    end: number,
    unit?: string,
    interval?: number,
): Promise<void> {
    if (['length'].includes(attributeName)) {
        throw new Error('length is a read-only property.');
    }

    return new Promise((resolve) => {
        interval = interval ?? 10; // Default interval to 10ms if not provided
        unit = unit ?? 'px';

        const startTime = performance.now(); // Capture the starting timestamp

        const id = setInterval(() => {
            const elapsed = performance.now() - startTime; // How much time has passed
            const t = Math.min(elapsed / duration, 1); // Normalize time to a value between 0 and 1
            const value = start + t * (end - start); // Interpolate linearly

            element.style[attributeName as any] = `${value}${unit}`;

            // End the animation once the duration is met
            if (t === 1) {
                clearInterval(id);
                resolve();
            }
        }, interval);
    });
}

/**
 * Represents Disco Mode, an interactive feature that transforms the website
 * into a dance party with flashing colors and music.
 */
export class DiscoMode {
    private body: HTMLElement;
    private colorToggleIntervalId: number | null = null;
    private discoBall: HTMLImageElement | null = null;
    private discoBallState: DiscoBallState = DiscoBallState.Raised;
    private discoBallUrl: Promise<string>;
    private discoTrack: HTMLAudioElement | null = null;
    private discoTrackUrl: Promise<string>;
    private mechanicalSound: HTMLAudioElement | null = null;
    private mechanicalSoundUrl: Promise<string>;
    private preferredColorScheme: PreferredColorScheme;
    private state: DiscoModeState = DiscoModeState.Disabled;

    /**
     * Creates an instance of DiscoMode.
     *
     * @param html - The root HTML element of the document.
     * @param preferredColorScheme - A utility for managing the site's color scheme.
     * @throws Will throw an error if the `<body>` element is not found in the provided HTML.
     */
    constructor(
        html: HTMLElement,
        preferredColorScheme: PreferredColorScheme
    ) {
        var body = html.getElementsByTagName('body')[0];

        if (body === undefined) {
            throw new Error('unable to get body from html element.');
        }

        console.log('disco-mode: booking the site...');
        this.body = body;

        console.log('disco-mode: booking the LJ...');
        this.preferredColorScheme = preferredColorScheme;

        console.log('disco-mode: booking the DJ...');
        this.discoTrackUrl = pixabay.audio.germanTechnoCowboy();

        console.log('disco-mode: marvelling at size of disco ball...');
        this.discoBallUrl = gifercom.gif.discoBall();

        console.log('disco-mode: oiling disco ball release mechanism...');
        this.mechanicalSoundUrl = pixabay.audio.garageDoorOpening();
    }

    /**
     * Enables Disco Mode, turning the website into a party with music and visual effects.
     *
     * @param seizureWarningAcknowledgment - A string acknowledging the seizure risk warning. Must match 'IKNOWITSFLASHY'.
     * @throws Will throw an error if audio playback is not allowed or if the acknowledgment is incorrect.
     */
    public async enable(seizureWarningAcknowledgment: string) {
        const acknowledgment = 'IKNOWITSFLASHY';
        if (seizureWarningAcknowledgment !== acknowledgment) {
            console.warn(
                `refusing to enable disco mode without seizure warning acknowledgment. Pass '${acknowledgment}' as the first argument. Enabling Disco Mode may involve flashing lights and rapidly changing visuals, which could potentially trigger seizures in individuals with photosensitive epilepsy or similar conditions. By passing the acknowledgment 'IKNOWITSFLASHY', you confirm that you understand the risks associated with enabling this feature.`
            )
            return;
        }

        if (this.state === DiscoModeState.Enabled) {
            console.warn(`The party has already started, enjoy!`);
            return;
        }
        if (this.state === DiscoModeState.InBetween) {
            console.warn(
                `Hold your horses, young whippersnapper! Let the party do it's thing. On a side note: This is an easter-egg... Do you really expect me to also implement the logic for this?`
            );
            return;
        }

        this.state = DiscoModeState.InBetween;

        console.log('disco-mode: checking DJ booth audio jacks...');
        if (!await canPlayAudio()) {
            throw new Error(
                'Disco\'s closed. Unable to playback audio. Check the site\'s permissions.'
            );
        }

        if (this.discoTrack === null) {
            var discoTrackUrl = await this.discoTrackUrl;

            this.discoTrack = new Audio(discoTrackUrl);
        }

        console.log('disco-mode: lowering disco ball...');
        await this.toggleIndicator();

        console.log('disco-mode: giving DJ the signal...');
        this.discoTrack?.play();

        // TODO: fix waiter not cleanly returning
        //await waitForAudioToStart(this.audio);

        console.log('disco-mode: giving LJ the signal...');
        this.startColorSchemeToggle();

        console.log('The party is in full swing...');
        this.state = DiscoModeState.Enabled;
    }

    /** 
     * Disables Disco Mode by stopping any playing music and resetting its
     * state.
     */
    public async disable() {
        if (this.state === DiscoModeState.Disabled) {
            console.warn(`There is no party to close, concerned citizen...`);
            return
        }
        // TODO: Deduplicate, since it's the same as in `enable`
        if (this.state === DiscoModeState.InBetween) {
            console.warn(
                `Hold your horses, young whippersnapper! Let the party do it's thing. On a side note: This is an easter-egg... Do you really expect me to also implement the logic for this?`
            );
            return;
        }

        this.state = DiscoModeState.InBetween;

        if (this.discoTrack !== null) {
            console.log('disco-mode: tipping the DJ and sending him home...');
            this.discoTrack?.pause();
            this.discoTrack.currentTime = 0;
        }

        else {
            console.warn('disco-mode: The DJ isn\'t even playing anymore?...');
        }

        console.log('disco-mode: tipping the LJ and sending him home...');
        this.stopColorSchemeToggle();


        console.log('disco-mode: raising disco ball...');
        await this.toggleIndicator();

        console.log('Party\'s over, time to go home...');
        this.state = DiscoModeState.Disabled;
    }

    /**
     * Starts rhythmically toggling the color scheme every 500ms.
     */
    private startColorSchemeToggle(): void {
        if (this.colorToggleIntervalId === null) {
            this.colorToggleIntervalId = window.setInterval(() => {
                this.preferredColorScheme.toggle();
                console.log('disco-mode: toggling color scheme...');
            }, 200);
        }
    }

    /**
     * Stops the rhythmic color scheme toggling.
     */
    private stopColorSchemeToggle(): void {
        if (this.colorToggleIntervalId !== null) {
            clearInterval(this.colorToggleIntervalId);
            this.colorToggleIntervalId = null;
        }

        console.log('disco-mode: turning the lights back on...');
        this.preferredColorScheme.toggle(ColorScheme.Dark);
    }

    /**
     * Hides, or unhides the disco mode indicator
     */
    private async toggleIndicator() {
        if (this.discoBallState === DiscoBallState.InBetween) {
            console.warn(
                `Hold your horses, young whippersnapper! The disco ball is going as fast as it can! On a side note: This is an easter-egg... Do you really expect me to also implement the logic to change the disco balls direction, while it's already moving.`
            );
            return;
        }

        const discoBallHeight = 300; //px

        if (this.mechanicalSound === null) {
            this.mechanicalSound = new Audio(await this.mechanicalSoundUrl);
        }

        if (this.discoBall === null) {
            this.discoBall = new Image();
            this.discoBall.style.position = 'absolute';
            this.discoBall.style.top = (
                this.discoBallState === DiscoBallState.Raised
            ) ? `-${discoBallHeight}px` : '0';
            this.discoBall.style.right = '0';
            this.discoBall.style.left =  '0';
            this.discoBall.style.marginLeft = 'auto';
            this.discoBall.style.marginRight = 'auto';
            this.discoBall.style.height = `${discoBallHeight}px`;
            this.discoBall.style.width = 'auto';
            this.discoBall.style.pointerEvents = 'none';
            this.discoBall.src = await this.discoBallUrl;
        }

        this.body.appendChild(this.discoBall as Node);

        // In Mullvad Browser, I get NaN when getting .duration on Audio
        // elements, so I assume this can't be relied upon. That's why we're
        // seeking until the end, get the current time, then seek back to the
        // start. Using a random will seek to the end. Couldn't find any
        // documentation on that, but it's logical
        // TODO: Check, why Mullvad Browser returns NaN
        this.mechanicalSound.currentTime = 10000;
        await waitForAudioEvent('seeked', this.mechanicalSound);
        const mechanicalSoundDuration = this.mechanicalSound.currentTime;
        this.mechanicalSound.currentTime = 0;
        await waitForAudioEvent('seeked', this.mechanicalSound);

        // Woah... This promise is worthless... ;)
        this.mechanicalSound.play();

        animateAttributeLinear(
            'top' as keyof WritableCSSProperty,
            this.discoBall,
            mechanicalSoundDuration * 1000,
            (
                this.discoBallState === DiscoBallState.Raised
            ) ? -1 * discoBallHeight : 0,
            (
                this.discoBallState === DiscoBallState.Raised
            ) ? 0 : -1 * discoBallHeight,
        );

        // yeah, yeah... I know, you can basically break the logic for a tiny
        // fraction of time, while the stuff before this statement gets
        // executed.
        // This is an easter egg, not a credit card transaction
        // 
        const discoBallStateSnapshot = this.discoBallState;
        this.discoBallState = DiscoBallState.InBetween;

        await waitForAudioEvent('ended', this.mechanicalSound);

        this.mechanicalSound?.pause();
        this.mechanicalSound.currentTime = 0;

        this.discoBallState = (
            discoBallStateSnapshot  === DiscoBallState.Raised
        ) ? DiscoBallState.Lowered : DiscoBallState.Raised;

        if (this.discoBallState === DiscoBallState.Raised) {
            this.body.removeChild(this.discoBall as Node);
        }
    }
}

