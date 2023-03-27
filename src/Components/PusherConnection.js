import { Pusher } from "@pusher/pusher-websocket-react-native";

const pusher = Pusher.getInstance();

export default async function ({ onSubscriptionSucceeded, onSubscriptionError, onEvent, onConnectionStateChange, onSubscriptionCount, channel, key }) {
    await pusher.init({
        apiKey: key ?? '2c97e0f6405c63bf12c2',
        cluster: 'ap2',
        onSubscriptionSucceeded,
        onSubscriptionError,
        onEvent,
        onConnectionStateChange,
        onSubscriptionCount
    });

    await pusher.connect();
    await pusher.subscribe({ channelName: channel });

    return async () => {
        await pusher.unsubscribe({ channelName: channel });
        await pusher.disconnect();
    }
};

// export default pusher;