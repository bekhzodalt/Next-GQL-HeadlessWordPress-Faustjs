import Tracker from '@openreplay/tracker'
import trackerGraphQL from '@openreplay/tracker-graphql';

type ORPPlugins = {
    plugins: {
        [key: string]: any
    }
}

let _tracker: Tracker = null;

export const tracker = init({
    plugins: {
        graphqlTracker: trackerGraphQL
    }
})

export function init({ plugins }: ORPPlugins) {
    const ingestPoint = process.env.NEXT_PUBLIC_ORP_URL
    const projectKey = process.env.NEXT_PUBLIC_ORP_KEY
    if (!ingestPoint || !projectKey) return

    const trackerConfig = {
        captureIFrames: false,
        defaultInputMode: 0,
        obscureTextNumbers: false,
        obscureTextEmails: false,
        obscureInputEmails: false,
        respectDoNotTrack: false,
        ingestPoint,
        projectKey,
        onStart: ({ sessionID }: { sessionID: string }) =>
            console.log('ORP: ', sessionID),
    }
    _tracker = new Tracker(trackerConfig)
    let pluginsList = {} as ORPPlugins['plugins']
    if (plugins) {
        Object.keys(plugins).forEach(plugin => {
            pluginsList[plugin] = _tracker.use(plugins[plugin]())
        })
    }
    return pluginsList
}

export function startTracker() {
    if (_tracker) return _tracker.start()
}

export function setTrackerUserId(user: string) {
    if (_tracker) return _tracker.setUserID(user)
}
