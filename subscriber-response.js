/**
 * Bản dễ đọc của đoạn sửa phản hồi thuê bao do anh cung cấp.
 * Chạy ở giai đoạn RESPONSE có body, trên đúng rule trả dữ liệu subscriber.
 * Các giá trị dưới đây được viết cứng theo mã gốc, không xác minh giao dịch.
 * File này không chứa filter, caption hoặc khung widget.
 */
(function () {
  if (typeof $response === 'undefined' || !$response ||
      typeof $response.body !== 'string' || !$response.body.trim()) {
    $done({});
    return;
  }

  let obj;
  try {
    obj = JSON.parse($response.body);
  } catch (error) {
    $done({});
    return;
  }

  function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  // Bỏ qua phản hồi không phải object hoặc có cấu trúc subscriber không phù hợp.
  if (!isObject(obj) ||
      (obj.subscriber !== undefined && obj.subscriber !== null && !isObject(obj.subscriber))) {
    $done({});
    return;
  }

  const subscriber = obj.subscriber || {};
  for (const field of ['subscriptions', 'entitlements']) {
    if (subscriber[field] !== undefined && subscriber[field] !== null &&
        !isObject(subscriber[field])) {
      $done({});
      return;
    }
  }

  // Mã gốc ghi Attention, không ghi version.
  obj.Attention = 'Chúc mừng bạn! Vui lòng không sử dụng chúng dưới mục đích thương mại!';

  const FAR_FUTURE = '9999-01-09T10:10:14Z';
  const PAST = '2005-01-09T10:10:14Z';
  const goldProduct = 'locket_1600_1y';

  function makeSub(displayName, priceAmount, currency) {
    return {
      auto_resume_date: null,
      display_name: displayName,
      is_sandbox: true,
      ownership_type: 'PURCHASED',
      billing_issues_detected_at: null,
      management_url: 'https://apps.apple.com/account/subscriptions',
      period_type: 'normal',
      price: { amount: priceAmount, currency: currency },
      expires_date: FAR_FUTURE,
      grace_period_expires_date: null,
      refunded_at: null,
      unsubscribe_detected_at: null,
      original_purchase_date: PAST,
      purchase_date: PAST,
      store: 'app_store',
      store_transaction_id: '2000001108724193'
    };
  }

  function makeEnt(productId) {
    return {
      grace_period_expires_date: null,
      purchase_date: PAST,
      product_identifier: productId,
      expires_date: FAR_FUTURE
    };
  }

  obj.subscriber = subscriber;
  subscriber.subscriptions = subscriber.subscriptions || {};
  subscriber.entitlements = subscriber.entitlements || {};

  // 0xe614 * 0xd + 0x2d0d3 - 0x8693f = 399000.
  subscriber.subscriptions[goldProduct] = makeSub(goldProduct, 399000, 'VND');
  subscriber.entitlements.Gold = makeEnt(goldProduct);

  $done({ body: JSON.stringify(obj) });
})();
