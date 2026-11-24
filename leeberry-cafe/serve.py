import http.server
import socketserver
import os
import sys

PORT = 8080
DIRECTORY = r"C:\Users\aksha\.gemini\antigravity\scratch\leeberry-cafe"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

if __name__ == "__main__":
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving {DIRECTORY} on port {PORT}")
        sys.stdout.flush()
        httpd.serve_forever()
