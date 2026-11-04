
(function () {
  if (typeof $request === 'undefined' || !$request || !$request.headers) {
    $done({});
    return;
  }

  const headersToStrip = new Set([
    'x-revenuecat-etag',
    'if-none-match',
    'if-modified-since',
    'x-goog-if-none-match'
  ]);

  const modifiedHeaders = { ...$request.headers };
  for (const key of Object.keys(modifiedHeaders)) {
    if (headersToStrip.has(key.toLowerCase())) {
      delete modifiedHeaders[key];
    }
  }

  $done({ headers: modifiedHeaders });
})();
