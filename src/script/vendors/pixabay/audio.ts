
export async function germanTechnoCowboy(): Promise<string> {
    const module = await import(
        /* webpackChunkName: "disco-track" */
        '../../../../vendor/pixabay/german-techno-cowboy-uplifting-trance-journey-300653.mp3'
    );
    return module.default; 
}

export async function garageDoorOpening(): Promise<string> {
    const module = await import(
        /* webpackChunkName: "mechanical-sound" */
        '../../../../vendor/pixabay/mechanical-garage-door-opener-door-closing-quad-30083-edited.mp3'
    );
    return module.default; 
}
