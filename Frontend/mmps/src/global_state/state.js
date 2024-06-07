import { reactive } from "vue";

export const timeLeft = reactive({ time: 120 });
export const timeTaken = reactive({ time: 0 });
export const capturing = reactive({ state: false });
export const showCamera = reactive({ state: false });
export const cancelLoading = reactive({ value: false })
export const view = reactive({ value: null })