const BASE = process.env.BASE_URL || 'http://localhost:3001';

// use global fetch (Node 18+). If not available, runtime will error.
const fetchFn: typeof fetch = (globalThis as any).fetch ? (globalThis as any).fetch.bind(globalThis) : (async () => { throw new Error('fetch is not available in this Node runtime'); }) as any;

function rand(n: number = 6) { return Math.random().toString(36).slice(2, 2 + n); }

async function run() {
  console.log('Starting integration tests against', BASE);

  // 1) create admin
  const adminEmail = `admin+${Date.now()}@example.com`;
  const adminPass = 'TestPass123!';
  let resp = await fetchFn(`${BASE}/api/auth/register`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: 'Test Admin', email: adminEmail, password: adminPass }) });
  const adminRes = await resp.json();
  if (!adminRes.success) { console.error('Admin register failed', adminRes); process.exit(1); }
  const adminToken = adminRes.token;
  console.log('Admin created');

  // 2) register vendor
  const vendorEmail = `vendor+${Date.now()}@example.com`;
  resp = await fetchFn(`${BASE}/api/auth/vendor/register`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({
    businessName: 'TestCo', fullName: 'Owner', ownerName: 'Owner', companyName: 'TestCo', email: vendorEmail, phone: '9999999999', serviceArea: 'Delhi', address: 'Some address', city: 'Delhi', state: 'DL', pincode: '110001', businessType: 'Installer', experience: 3, password: 'VendorPass123!', documents: []
  }) });
  const vendorReg = await resp.json();
  if (!vendorReg.success) { console.error('Vendor register failed', vendorReg); process.exit(1); }
  if (!vendorReg.debugOtp) { console.error('Server did not return debugOtp; ensure NODE_ENV=test'); process.exit(1); }
  console.log('Vendor registration OTP issued');

  // 3) confirm vendor
  resp = await fetchFn(`${BASE}/api/auth/verify-email/confirm`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ token: vendorReg.token, otp: vendorReg.debugOtp }) });
  const confirm = await resp.json();
  if (!confirm.success) { console.error('Vendor confirm failed', confirm); process.exit(1); }
  const vendorId = confirm.vendor?.id;
  console.log('Vendor confirmed and created:', vendorId);

  // 4) approve vendor as admin
  resp = await fetchFn(`${BASE}/api/vendors/${vendorId}/approve`, { method: 'POST', headers: { 'content-type': 'application/json', 'authorization': `Bearer ${adminToken}` }, body: JSON.stringify({ note: 'Approval in test' }) });
  const approve = await resp.json();
  if (!approve.success) { console.error('Vendor approve failed', approve); process.exit(1); }
  console.log('Vendor approved');

  console.log('All integration tests passed');
}

run().catch((err) => { console.error(err); process.exit(1); });
