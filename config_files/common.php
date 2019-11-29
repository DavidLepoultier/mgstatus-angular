<?php

// Send a header
function send_header($name, $value)
{
        header($name.': '.$value);
}

// Send the HTTP status ; add common headers
function send_status($status)
{
        header('HTTP/1.0 '.$status, true, $status);

        // X-OAPI-Request-Id
        $headers = apache_request_headers();
        if (isset($headers['X-OAPI-Request-Id']))
                send_header('X-OAPI-Request-Id', $headers['X-OAPI-Request-Id']);
}

// Send given $array as child of node $name in a json response body
function send_json($name, $array)
{
        // Headers specific to sent body
        send_header('Content-Type', 'application/json; charset=utf-8');

//      $out = array();
//      $out[$name] = $array;
        print(json_encode($array));
}

// Send error information as json body
function send_error($code = 0, $message = '', $description = '')
{
        $error = array();
        $error['code'] = $code;
        $error['message'] = $message;
        $error['description'] = $description;

        // ----- Output resulting json
        send_json('error', $error);
}

// Helper: return either the array entry named $param or an empty string if entry not found in array
function array_get($array, $entry)
{
        return isset($array[$entry]) ? $array[$entry] : '';
}

?>