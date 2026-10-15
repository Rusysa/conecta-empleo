export function notImplemented(feature) {
  return (_req, res) => res.status(501).json({
    error: { code: 'NOT_IMPLEMENTED', message: `El módulo ${feature} está pendiente de implementación.` },
  });
}
