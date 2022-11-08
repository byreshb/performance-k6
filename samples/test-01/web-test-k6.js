import http from 'k6/http';
import { parseHTML } from 'k6/html';
import { check, group, sleep } from 'k6';

/**
 * stages and thresholds defined for an individual test
 */
export let options = {
  stages: [
    { duration: '1s', target: 1 }
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],   // http errors should be less than 1% 
    http_req_duration: ['p(95)<300'], // 95% of requests should be below 300ms
  },
};

/**
 * Simple test script to access a page and click login href link
 */
export default function () {
  let resp = null;
  group('Access home page', function() {
    resp = http.get('https://stage.radialhub.com');

    check(resp, {
      'Response code is 200': (res) => res.status == 200,
      'Title for Radialhub - Online Freelancing Jobs': (res) => parseHTML(res.body).find('head title').text() == "Online Freelancing Jobs | Marketplace | Gigs",
    });
  });

  group('Access Login Page', function() {
    const loginResp = resp.clickLink({
      selector: "a[href='/anon/login']"
    });
  
    check(loginResp, {
      'Response code is 200': (res) => res.status == 200,
      'Login Title for Radialhub - Login': (res) => parseHTML(res.body).find('head title').text() == "Login or Create an Account - radialhub",
    });
  });

  sleep(1);
}
