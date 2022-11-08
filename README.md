Performace testing - K6
---------------------

* Introduction
* Run k6 on locally on a web page
  * Scenario:
    * Include options (stages and thresholds) in a test script
    * Access a web page
    * Search and click on a link
    * Perform assertions
    * View report on terminal
    * <b>script to run</b>: ./samples/test-01/web-test-k6.js
* Run k6 on an API
  * Scneario:
    * Make an HTTP get request
    * Pass HEADERS
    * Use thresholds from an external files (profiles)
    * Assert response
    * <b>script to run</b>: ./samples/test-02/http_get-k6.js
* Run k6 on a to show grafana
  * Scneario:
    * Use docker-compose to services (InfluxDB, Grafana and K6)
    * Run docker containers
    * Run K6 script along with it
    * Output the data to influxDB and view the results in grafana dashboard
    * <b>script to run</b>: ./samples/test-03/grafana-report-k6.js
* Explanation of a framework using CI/CD pipeline
