import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        step1Title?: string;
        step1Subtitle?: string;
        step1ButtonText?: string;
        step2Title?: string;
        step2Subtitle?: string;
        step2CheckInIntervalSeconds?: number;
        step2EnableAutoCheckIns?: boolean;
        step2Distractions?: string[];
        step3Title?: string;
        step3Subtitle?: string;
        step3ButtonText?: string;
        step3RatingFactors?: string[];
        moodOptions?: string[];
        moodEmojis?: Record<string, string>;
        distractionEmojis?: Record<string, string>;
    };
    events: {
        sessionStart: CustomEvent<{
            startMood: string;
        }>;
        sessionEnd: CustomEvent<{}>;
        checkIn: CustomEvent<{
            distractions: string[];
        }>;
        sessionComplete: CustomEvent<{
            startMood: string;
            distractions: string[];
            checkInCount: number;
            endMood: string;
            ratings: Record<string, number>;
        }>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            elapsedSeconds: number;
        };
        'bottom-bar': {
            currentStep: 1;
            handleEndSession: () => void;
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type SessionTimelineProps = typeof __propDef.props;
export type SessionTimelineEvents = typeof __propDef.events;
export type SessionTimelineSlots = typeof __propDef.slots;
export default class SessionTimeline extends SvelteComponent<SessionTimelineProps, SessionTimelineEvents, SessionTimelineSlots> {
}
export {};
