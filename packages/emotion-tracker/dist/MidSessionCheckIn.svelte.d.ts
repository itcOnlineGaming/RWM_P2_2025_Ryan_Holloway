import { SvelteComponent } from "svelte";
import type { CheckInEvent } from './types';
declare const __propDef: {
    props: {
        title?: string;
        subtitle?: string;
        buttonText?: string;
        distractions?: string[];
        distractionEmojis?: Record<string, string>;
        selectedDistractions?: string[];
        show?: boolean;
        disabled?: boolean;
    };
    events: {
        save: CustomEvent<CheckInEvent>;
        close: CustomEvent<void>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
    exports?: {} | undefined;
    bindings?: string | undefined;
};
type MidSessionCheckInProps_ = typeof __propDef.props;
export { MidSessionCheckInProps_ as MidSessionCheckInProps };
export type MidSessionCheckInEvents = typeof __propDef.events;
export type MidSessionCheckInSlots = typeof __propDef.slots;
export default class MidSessionCheckIn extends SvelteComponent<MidSessionCheckInProps_, MidSessionCheckInEvents, MidSessionCheckInSlots> {
}
