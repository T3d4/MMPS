import { reactive } from "vue";

export const timeLeft = reactive({ time: 120 });
export const timeTaken = reactive({ time: 0 });
export const verified = reactive({ state: false });
export const capturing = reactive({ state: false });