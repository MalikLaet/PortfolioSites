export function calculateProcessProgress(
  sectionTop: number,
  sectionHeight: number,
  viewportHeight: number,
  mobile: boolean,
): number {
  const trigger = viewportHeight * (mobile ? 0.62 : 0.78);
  const progress = (trigger - sectionTop) / Math.max(sectionHeight * 0.72, 1);
  return Math.min(Math.max(progress, 0), 1);
}

export function isProcessStepActive(index: number, progress: number, mobile: boolean): boolean {
  const threshold = mobile ? (index + 0.35) / 4 - 0.1 : (index + 0.5) / 4 - 0.12;
  return progress >= threshold;
}
