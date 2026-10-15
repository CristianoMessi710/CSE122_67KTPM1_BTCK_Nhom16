/** Early lifecycle listeners for the optional native cross-page crossfade.
 * Kept as a tiny classic head script so pagereveal is handled before ES modules load.
 * It never catches application errors.
 */
for (const name of ['pagereveal', 'pageswap']) {
    window.addEventListener(name, (event) => {
        const transition = event.viewTransition;
        if (!transition) return;
        transition.ready.catch(() => {});
        transition.finished.catch(() => {});
        transition.updateCallbackDone?.catch(() => {});
    });
}

// A browser can cancel the optional snapshot before exposing its lifecycle
// event (for example when navigating through a loading/error page). Ignore
// this exact native cancellation; do not suppress unrelated promise failures.
window.addEventListener('unhandledrejection', (event) => {
    if (
        event.reason instanceof DOMException &&
        event.reason.name === 'InvalidStateError' &&
        event.reason.message ===
            'Transition was aborted because of invalid state. ViewTransition opt-in disabled'
    )
        event.preventDefault();
});
