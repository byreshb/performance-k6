import http from "k6/http";
import { check, group, sleep } from "k6";
import { Counter, Rate, Trend } from "k6/metrics";
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.0.0/index.js";

const loginData = JSON.parse(open("./users.json"));

/**
 * Global options for the script
 * stages - Ramping pattern which includes VUs with duration
 * thresholds - assertion criteria for the test (pass/fail)
 */
export let options = {
    stages: [
        { target: 2, duration: "1s" },
        { target: 2, duration: "3s" },
        { target: 0, duration: "1s" }
    ],
    thresholds: {
        "http_req_duration": ["p(95)<500"],
        "http_req_duration{staticAsset:yes}": ["p(95)<100"],
        "check_failure_rate": ["rate<0.3"]
    },
};

// Define some Custom metrics
// A metric that cumulatively sums added values.
let successfulLogins = new Counter("successful_logins");

// A metric that tracks the percentage of added values that are non-zero.
let checkFailureRate = new Rate("check_failure_rate");

// A metric that allows for calculating statistics on the added values (min, max, average and percentiles).
let timeToFirstByte = new Trend("time_to_first_byte", true);

/**
 * This is the main fucntion where VUs will loop during test execution. 
 */
export default function() {
    // To organize test results, tests are grouped
    group("Front page", function() {
        let res = http.get("http://test.k6.io/?ts=" + Math.round(randomIntBetween(1,2000)), { tags: { name: "http://test.k6.io/ Aggregated"}});
        let checkRes = check(res, {
            "Homepage body size is 11026 bytes": (r) => r.body.length === 11026, //fail
            "Homepage welcome header present": (r) => r.body.indexOf("Welcome to the k6.io demo site!") !== -1 // pass
        });
        
        checkFailureRate.add(!checkRes);
        
        timeToFirstByte.add(res.timings.waiting);

        // Testing static assets
        group("Static assets", function() {
            let res = http.batch([
                ["GET", "http://test.k6.io/static/css/site.css", {}, { tags: { staticAsset: "yes" } }],
                ["GET", "http://test.k6.io/static/js/prisms.js", {}, { tags: { staticAsset: "yes" } }]
            ]);
            checkRes = check(res[0], {
                "Is stylesheet 4859 bytes?": (r) => r.body.length === 4859,
            });
            
            checkFailureRate.add(!checkRes);
            
            timeToFirstByte.add(res[0].timings.waiting);
            timeToFirstByte.add(res[1].timings.waiting);
        });

    });
    
    sleep(1);

    group("Login", function() {
        let res = http.get("http://test.k6.io/my_messages.php");
        let checkRes = check(res, {
            "Users should not be auth'd. Is unauthorized header present?": (r) => r.body.indexOf("Unauthorized") !== -1
        });
            
        //extracting the CSRF token from the response
        let vars = {};

        vars["csrftoken"] = res
            .html()
            .find("input[name=csrftoken]")
            .first()
            .attr("value");

        // Record check failures
        checkFailureRate.add(!checkRes);

        let position = Math.floor(Math.random()*loginData.users.length);
        let credentials = loginData.users[position];

        res = http.post("http://test.k6.io/login.php", { login: credentials.username, password: credentials.password, redir: '1', csrftoken: `${vars["csrftoken"]}` });
        checkRes = check(res, {
            "is logged in welcome header present": (r) => r.body.indexOf("Welcome, admin!") !== -1
        });

        // Record successful logins
        if (checkRes) {
            successfulLogins.add(1);
        }

        // Record check failures
        checkFailureRate.add(!checkRes);

        // Record time to first byte
        timeToFirstByte.add(res.timings.waiting);

        // sleep(10);
        sleep(1);
    });
}
