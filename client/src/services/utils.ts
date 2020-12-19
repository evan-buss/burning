export const saveState = (
  key: string,
  state: any,
  useSessionStorage = false
): void => {
  if (!state) return;
  try {
    const serialized = JSON.stringify(state);
    if (useSessionStorage) {
      sessionStorage.setItem(key, serialized);
    } else {
      localStorage.setItem(key, serialized);
    }
  } catch (err) {
    console.log(err);
  }
};

export const loadState = (
  key: string,
  useSessionStorage = false
): string | undefined => {
  try {
    let state: string | null;
    if (useSessionStorage) {
      state = sessionStorage.getItem(key);
    } else {
      state = localStorage.getItem(key);
    }
    return state ? JSON.parse(state) : undefined;
  } catch (err) {
    console.log(err);
  }
};
