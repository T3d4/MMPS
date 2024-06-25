import { reactive } from "vue";

export const timeLeft = reactive({ time: 0 });
export const timeTaken = reactive({ time: 0 });
export const capturing = reactive({ state: false });
export const showCamera = reactive({ state: false });
export const cancelLoading = reactive({ value: false })
export const view = reactive({ value: null })
export const currentTabState = reactive({ value: "details" })
export const verified = reactive({ value: false })
export const quiz_id = reactive({ value: "" })

export function updateTimeLeft(newValue) {
    timeLeft.time = newValue
}

export function updateTimeTaken(newValue) {
    timeTaken.time = newValue
}