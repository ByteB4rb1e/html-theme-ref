import { PreferredColorScheme } from './preferred-color-scheme';
import * as pixabay from '../../vendors/pixabay';

enum DiscoBallState {
    TRANSIT,
    RAISED,
    LOWERED
}

async function canPlayAudio() {
    const audio = new Audio(
        'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAAAB9AAACABAAZGF0YQAAAAA='
    );
    audio.muted = true;

    try {
        await audio.play();
        console.log('audio autoplay is allowed');
        return true;
    } catch (error) {
        console.warn('audio autoplay is blocked:', error);
        return false;
    }
}

export class DiscoMode {
    private body: HTMLElement;
    private preferredColorScheme: PreferredColorScheme;
    private audio: HTMLAudioElement | null = null;
    private discoTrack: Promise<string>;

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
        this.discoTrack = pixabay.audio.germanTechnoCowboy();
    }


    public async enable(seizureWarningAcknowledgment: string) {
        const acknowledgment = 'IKNOWITSFLASHY';
        if (seizureWarningAcknowledgment !== acknowledgment) {
            console.error(
                `refusing to enable disco mode without seizure warning acknowledgment. Pass '${acknowledgment}' as the first argument.`
            )
        }

        console.log('disco-mode: checking DJ booth audio jacks...');
        if (!canPlayAudio()) {
            throw new Error(
                'unable to playback audio. Check the site\'s permissions.'
            );
        }

        if (this.audio === null) {
            var discoTrack = await this.discoTrack;

            this.audio = new Audio(discoTrack);
        }

        this.audio?.play();
    }

    public disable() {
        if (this.audio !== null) {
            this.audio?.pause();
            this.audio.currentTime = 0;
        }
    }
}

