// Test the default route
async function testDefaultRoute() {
  try {
    console.log('Testing connection to http://localhost:5187...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5187);

    const response = await fetch('http://localhost:5187', { 
      signal: controller.signal 
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`Server responded with status: ${response.status} (${response.statusText})`);
      console.error('Response headers:', Object.fromEntries([...response.headers.entries()]));
      const errorText = await response.text();
      console.error('Response body:', errorText);
      return false;
    }

    const text = await response.text();
    console.log('Raw response:', text);

    try {
      const data = JSON.parse(text);
      console.log('Default route response:', data);
      return true;
    } catch (jsonError) {
      console.error('Error parsing JSON response:', jsonError.message);
      return false;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timed out. The server might not be running.');
    } else {
      console.error('Error testing default route:', error.message);
    }
    return false;
  }
}

// Test the login route
async function testLoginRoute() {
  try {
    console.log('Testing connection to http://localhost:5187/api/v1/auth/login...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5187);

    const response = await fetch('http://localhost:5187/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'password123'
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`Server responded with status: ${response.status} (${response.statusText})`);
      console.error('Response headers:', Object.fromEntries([...response.headers.entries()]));
      const errorText = await response.text();
      console.error('Response body:', errorText);
      return false;
    }

    const text = await response.text();
    console.log('Raw response:', text);

    try {
      const data = JSON.parse(text);
      console.log('Login route response:', data);
      return true;
    } catch (jsonError) {
      console.error('Error parsing JSON response:', jsonError.message);
      return false;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timed out. The server might not be running.');
    } else {
      console.error('Error testing login route:', error.message);
    }
    return false;
  }
}

// Test different ports
async function testPort(port) {
  console.log(`\nTesting port ${port}...`);

  try {
    console.log(`Testing connection to http://localhost:${port}...`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5187);

    const response = await fetch(`http://localhost:${port}`, { 
      signal: controller.signal 
    });
    clearTimeout(timeoutId);

    console.log(`Port ${port} responded with status: ${response.status} (${response.statusText})`);
    const text = await response.text();
    console.log('Raw response:', text);

    try {
      const data = JSON.parse(text);
      console.log('Response as JSON:', data);
      return true;
    } catch (jsonError) {
      console.log('Response is not valid JSON');
      return false;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`Port ${port}: Request timed out. No service is responding on this port.`);
    } else {
      console.error(`Port ${port}: Error:`, error.message);
    }
    return false;
  }
}

// Run the tests
async function runTests() {
  console.log('Testing API connectivity on different ports...');

  // Test common ports
  const ports = [3000, 3001, 4000, 5187, 8000, 8080];

  for (const port of ports) {
    await testPort(port);
  }
}

runTests();
