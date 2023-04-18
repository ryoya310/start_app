#!/home/アカウント/local/python/bin/python3
# encoding: utf-8

import os, sys

# Python3.10の場合
sys.path.append("/home/アカウント/local/python/lib/python3.10/site-packages")
sys.path.append('/home/アカウント/www/この[CGI]を設置するパス/')

def run_with_cgi(application):

    environ = dict(os.environ.items())
    environ['wsgi.input'] = sys.stdin.buffer
    environ['wsgi.errors'] = sys.stderr.buffer
    environ['wsgi.version'] = (1,0)
    environ['wsgi.multithread'] = False
    environ['wsgi.multiprocess'] = True
    environ['wsgi.run_once'] = True

    if environ.get('HTTPS','off') in ('on','1'):
        environ['wsgi.url_scheme'] = 'https'
    else:
        environ['wsgi.url_scheme'] = 'http'

    headers_set  = []
    headers_sent = []

    def write(data):
        if not headers_set:
            raise AssertionError("write() before start_response()")

        elif not headers_sent:
            status, response_headers = headers_sent[:] = headers_set
            sys.stdout.buffer.write(('Status: %s\r\n' % status).encode("ascii"))
            for header in response_headers:
                sys.stdout.buffer.write(('%s: %s\r\n' % header).encode("ascii"))
            sys.stdout.buffer.write(('\r\n').encode("ascii"))

        sys.stdout.buffer.write(data)
        sys.stdout.buffer.flush()

    def start_response(status,response_headers,exc_info=None):
        if exc_info:
            try:
                if headers_sent:
                    raise exc_info[0](exc_info[1]).with_traceback(exc_info[2])
            finally:
                exc_info = None
        elif headers_set:
            raise AssertionError("Headers already set!")

        headers_set[:] = [status,response_headers]
        return write

    result = application(environ, start_response)
    try:
        for data in result:
            if data:
                write(data)
        if not headers_sent:
            write('')
    finally:
        if hasattr(result,'close'):
            result.close()

os.environ['DJANGO_SETTINGS_MODULE'] = 'api.settings'
from django.core.wsgi import get_wsgi_application
run_with_cgi(get_wsgi_application())