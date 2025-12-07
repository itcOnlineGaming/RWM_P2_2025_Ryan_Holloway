import { SvelteComponent } from "svelte";
import type { EndSessionProps, SessionCompleteEvent } from './types';
declare const __propDef: {
    props: {
        title?: EndSessionProps["title"];
        subtitle?: EndSessionProps["subtitle"];
        buttonText?: EndSessionProps["buttonText"];
        moodOptions?: EndSessionProps["moodOptions"];
        moodEmojis?: EndSessionProps["moodEmojis"];
        ratingFactors?: EndSessionProps["ratingFactors"];
        disabled?: EndSessionProps["disabled"];
        selectedMood?: string;
        ratings?: Record<string, number>;
    };
    events: {
        sessionComplete: CustomEvent<SessionCompleteEvent>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
    exports?: {} | undefined;
    bindings?: string | undefined;
};
type EndSessionProps_ = typeof __propDef.props;
export { EndSessionProps_ as EndSessionProps };
export type EndSessionEvents = typeof __propDef.events;
export type EndSessionSlots = typeof __propDef.slots;
export default class EndSession extends SvelteComponent<EndSessionProps_, EndSessionEvents, EndSessionSlots> {
    get title(): string | undefined;
    /**accessor*/
    set title(_: string | undefined);
    get subtitle(): string | undefined;
    /**accessor*/
    set subtitle(_: string | undefined);
    get buttonText(): string | undefined;
    /**accessor*/
    set buttonText(_: string | undefined);
    get moodOptions(): string[] | undefined;
    /**accessor*/
    set moodOptions(_: string[] | undefined);
    get moodEmojis(): Record<string, string> | undefined;
    /**accessor*/
    set moodEmojis(_: Record<string, string> | undefined);
    get ratingFactors(): string[] | undefined;
    /**accessor*/
    set ratingFactors(_: string[] | undefined);
    get disabled(): boolean | undefined;
    /**accessor*/
    set disabled(_: boolean | undefined);
    get selectedMood(): string | undefined;
    /**accessor*/
    set selectedMood(_: string | undefined);
    get ratings(): Record<string, number> | undefined;
    /**accessor*/
    set ratings(_: Record<string, number> | undefined);
}
