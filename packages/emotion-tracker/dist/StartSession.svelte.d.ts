import { SvelteComponent } from "svelte";
import type { StartSessionEvent } from './types';
declare const __propDef: {
    props: {
        title?: string;
        subtitle?: string;
        buttonText?: string;
        moodOptions?: string[];
        moodEmojis?: Record<string, string>;
        selectedMood?: string | null;
        disabled?: boolean;
    };
    events: {
        moodSelect: CustomEvent<{
            mood: string;
        }>;
        start: CustomEvent<StartSessionEvent>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
    exports?: {} | undefined;
    bindings?: string | undefined;
};
type StartSessionProps_ = typeof __propDef.props;
export { StartSessionProps_ as StartSessionProps };
export type StartSessionEvents = typeof __propDef.events;
export type StartSessionSlots = typeof __propDef.slots;
export default class StartSession extends SvelteComponent<StartSessionProps_, StartSessionEvents, StartSessionSlots> {
}
