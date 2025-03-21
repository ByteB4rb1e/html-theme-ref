
export async function germanTechnoCowboy(): Promise<string> {
    const module = await import(
        /* webpackChunkName: "disco-track" */ '../../../../vendor/pixabay/german-techno-cowboy-uplifting-trance-journey-300653.mp3'
    );
    return module.default; 
}
