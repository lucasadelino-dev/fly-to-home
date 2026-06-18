type ToastFn = (msg: string, type: 'success' | 'error') => void;
let _fn: ToastFn = () => {};

export const setToastFn = (fn: ToastFn) => { _fn = fn; };
export const toast = {
  success: (msg: string) => _fn(msg, 'success'),
  error: (msg: string) => _fn(msg, 'error'),
};
