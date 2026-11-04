/**
 * Giải rối từ deleteHeader by duyvinh09 — V2.0.0.
 * Chạy ở giai đoạn REQUEST, trên đúng rule đã cấu hình.
 * Giữ nguyên danh sách 4 header của mã gốc; không tự xóa toàn bộ cache.
 */
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
