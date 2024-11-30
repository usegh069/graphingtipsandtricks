// service-worker.js
self.addEventListener('install', (event) => {
    event.waitUntil(self.skipWaiting());
  });
  
  self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
  });
  
  self.addEventListener('fetch', (event) => {
    const requestId = Math.random().toString(16).slice(2);
    
    // Create headers object from request headers
    const headers = {};
    for (const [key, value] of event.request.headers.entries()) {
      headers[key] = value;
    }
  
    // Send initial request details to all clients
    const requestDetails = {
      type: 'request-start',
      id: requestId,
      url: event.request.url,
      method: event.request.method,
      headers: headers,
      body: event.request.body ? event.request.body.toString() : null,
      timestamp: Date.now()
    };
  
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage(requestDetails);
      });
    });
  
    event.respondWith(
      fetch(event.request)
        .then(async response => {
          // Clone the response to read headers and body
          const responseClone = response.clone();
          
          // Create headers object from response headers
          const responseHeaders = {};
          for (const [key, value] of response.headers.entries()) {
            responseHeaders[key] = value;
          }
  
          // Get content type
          const contentType = response.headers.get('content-type') || '';
  
          // Handle different content types
          let responseData;
          let responseFormat;
  
          if (contentType.includes('image/')) {
            // For images, convert to base64
            const blob = await responseClone.blob();
            responseData = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(blob);
            });
            responseFormat = 'image';
          } else if (contentType.includes('application/json')) {
            // For JSON, parse it
            responseData = await responseClone.text();
            try {
              // Verify it's valid JSON by parsing and stringifying
              JSON.parse(responseData);
              responseFormat = 'json';
            } catch (e) {
              responseFormat = 'text';
            }
          } else if (contentType.includes('text/html')) {
            responseData = await responseClone.text();
            responseFormat = 'html';
          } else {
            // Default to text
            responseData = await responseClone.text();
            responseFormat = 'text';
          }
  
          // Send response details to all clients
          const responseDetails = {
            type: 'request-complete',
            id: requestId,
            url: event.request.url,
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
            timestamp: Date.now(),
            response: responseData,
            responseFormat: responseFormat
          };
  
          self.clients.matchAll().then(clients => {
            clients.forEach(client => {
              client.postMessage(responseDetails);
            });
          });
  
          return response;
        })
        .catch(error => {
          // Send error details to all clients
          const errorDetails = {
            type: 'request-error',
            id: requestId,
            url: event.request.url,
            error: error.message,
            timestamp: Date.now()
          };
  
          self.clients.matchAll().then(clients => {
            clients.forEach(client => {
              client.postMessage(errorDetails);
            });
          });
  
          throw error;
        })
    );
  });