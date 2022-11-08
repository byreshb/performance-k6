import http from 'k6/http';
import { check } from 'k6';

/**
 * Test for showing custom heaeders and config options
 */
export default function () {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'X-Test-Type': 'k6Runner',
    },
    redirects: 1,
  };
  let resp = http.get('https://api.sampleapis.com/avatar/info', params);

  check(resp, {
    'Is status 200' : res => res.status === 200,
    'There are 2 creators' : res => res.json()[0]["creators"].length === 2,
  });
}

// k6 run --config ./samples/test-02/config/options.json ./samples/test-02/http_get-k6.js
