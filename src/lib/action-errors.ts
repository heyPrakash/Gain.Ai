const SERVER_COMPONENTS_PRODUCTION_ERROR =
  'An error occurred in the Server Components render';

export function getActionErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error) {
    const digest = (error as Error & { digest?: string }).digest;
    const isServerComponentsMaskedError = error.message.includes(
      SERVER_COMPONENTS_PRODUCTION_ERROR
    );

    if (isServerComponentsMaskedError) {
      return digest
        ? `${fallbackMessage} (Reference: ${digest})`
        : fallbackMessage;
    }

    return error.message;
  }

  return fallbackMessage;
}
