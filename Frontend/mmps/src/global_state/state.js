import { reactive } from "vue";

export const timeLeft = reactive({ time: parseInt(localStorage.getItem('timeLeft')) || 0, });
export const timeTaken = reactive({ time: parseInt(localStorage.getItem('timeTaken')) || 0, });
export const capturing = reactive({ state: false });
export const showCamera = reactive({ state: false });
export const cancelLoading = reactive({ value: false })
export const view = reactive({ value: null })
export const currentTabState = reactive({ value: "details" })
export const verified = reactive({ value: false })
export const quiz_id = reactive({ value: "" })

export function updateTimeLeft(newValue) {
    timeLeft.time = newValue
    localStorage.setItem('timeLeft', newValue.toString())
}

export function updateTimeTaken(newValue) {
    timeTaken.time = newValue
    localStorage.setItem('timeTaken', newValue.toString())
}