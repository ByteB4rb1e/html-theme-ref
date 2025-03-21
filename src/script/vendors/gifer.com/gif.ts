
export async function discoBall(): Promise<string> {
    const module = await import(
        /* webpackChunkName: "disco-track" */
        '../../../../vendor/gifer.com/XVny.gif'
    );
    return module.default; 
}

