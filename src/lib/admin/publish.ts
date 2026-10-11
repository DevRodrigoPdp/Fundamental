export async function triggerPublish(): Promise<{ triggered: boolean }> {
  const hookUrl = import.meta.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hookUrl) return { triggered: false };
  try {
    await fetch(hookUrl, { method: 'POST' });
    return { triggered: true };
  } catch (e) {
    console.error('Error disparando deploy hook:', (e as Error).message);
    return { triggered: false };
  }
}
