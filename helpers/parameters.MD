##### http_req_duration
Total time for request, excluding time spent blocked (http_req_blocked), DNS lookup (http_req_looking_up) and TCP connect (http_req_connecting) time.

*<u>This metric can be further broken down as:</u>*

##### http_req_tls_handshaking
Time spent handshaking TLS session with the remote host.

#####  http_req_sending
Time spent sending data to the remote host.

##### http_req_waiting
Time spent waiting for response from remote host (a.k.a. "time to first byte", or "TTFB").

##### http_req_receiving
Time spent receiving response data from the remote host.

*These metrics measure delays and durations on the client:*

##### http_req_blocked
Time spent blocked (waiting for a free TCP connection slot) before initiating the request.

##### http_req_looking_up
Time spent looking up the remote hostname in DNS.

##### http_req_connecting
Time spent establishing TCP connection to remote host.
