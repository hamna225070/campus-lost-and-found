const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/db');
const { autoSeedIfEmpty } = require('../config/autoSeed');
const User = require('../models/User');
const { Item } = require('../models/Item');
const { app } = require('../server');

const runTests = async () => {
  console.log('====================================================');
  console.log('   CAMPUS LOST & FOUND PORTAL - TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, details = '') => {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${testName} - ${details}`);
      failed++;
    }
  };

  let server;

  try {
    console.log('[Test Setup] Connecting to database...');
    await connectDB();
    await autoSeedIfEmpty();

    const PORT = 5055;
    server = app.listen(PORT);
    const baseUrl = `http://localhost:${PORT}/api`;
    console.log(`[Test Setup] Test server listening on http://localhost:${PORT}/api\n`);

    // Clear test artifacts
    await User.deleteMany({ email: /test.*@campus\.edu/ });

    console.log('--- 1. Authentication & Security Tests ---');

    // 1. A new student can register
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Student Alpha',
        email: 'teststudent1@campus.edu',
        password: 'Password@123',
        confirmPassword: 'Password@123',
      }),
    });
    const regData = await regRes.json();
    assert(regRes.status === 201 && regData.token, '1. A new student can register', JSON.stringify(regData));
    const student1Token = regData.token;
    const student1Id = regData.user?._id;

    // 2. Duplicate email registration is rejected
    const dupRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Another Student',
        email: 'teststudent1@campus.edu',
        password: 'Password@123',
        confirmPassword: 'Password@123',
      }),
    });
    assert(dupRes.status === 409, '2. Duplicate email registration is rejected with 409 Conflict');

    // 3. A registered student can log in
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'teststudent1@campus.edu',
        password: 'Password@123',
      }),
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200 && loginData.token, '3. A registered student can log in');

    // 4. An incorrect password is rejected
    const badLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'teststudent1@campus.edu',
        password: 'WrongPassword999',
      }),
    });
    assert(badLoginRes.status === 401, '4. An incorrect password is rejected with 401');

    console.log('\n--- 2. Item Creation & Filtering Tests ---');

    // 5. A logged-in student can create a lost-item report
    const lostItemRes = await fetch(`${baseUrl}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${student1Token}`,
      },
      body: JSON.stringify({
        title: 'Lost Leather Backpack (Black)',
        description: 'Lost my black backpack with college textbooks inside.',
        category: 'Bags',
        type: 'lost',
        location: 'Library 3rd floor quiet area',
        dateOfIncident: '2026-10-20',
        imageUrl: '',
        contactInfo: 'student1@campus.edu | 555-0101',
      }),
    });
    const lostItemData = await lostItemRes.json();
    assert(lostItemRes.status === 201 && lostItemData.item, '5. A logged-in student can create a lost-item report');
    const createdLostId = lostItemData.item?._id;

    // 6. A logged-in student can create a found-item report
    const foundItemRes = await fetch(`${baseUrl}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${student1Token}`,
      },
      body: JSON.stringify({
        title: 'Found TI-84 Plus CE Graphing Calculator',
        description: 'Left on the desk in Room 301 after afternoon calculus.',
        category: 'Electronics',
        type: 'found',
        location: 'Science Building Room 301',
        dateOfIncident: '2026-10-21',
        imageUrl: '',
        contactInfo: 'Math Dept Reception Desk',
      }),
    });
    const foundItemData = await foundItemRes.json();
    assert(foundItemRes.status === 201 && foundItemData.item, '6. A logged-in student can create a found-item report');
    const createdFoundId = foundItemData.item?._id;

    // 7. Created reports appear in the listings
    const listRes = await fetch(`${baseUrl}/items`);
    const listData = await listRes.json();
    const hasLost = listData.items.some((i) => i._id === createdLostId);
    const hasFound = listData.items.some((i) => i._id === createdFoundId);
    assert(listRes.status === 200 && hasLost && hasFound, '7. Created reports appear in public item listings');

    // 8. Search and category filters work
    const searchRes = await fetch(`${baseUrl}/items?search=Backpack&category=Bags`);
    const searchData = await searchRes.json();
    assert(
      searchRes.status === 200 &&
        searchData.items.length >= 1 &&
        searchData.items.every((i) => i.category === 'Bags'),
      '8. Search by keyword and category filters work accurately'
    );

    console.log('\n--- 3. Authorization & Permissions Tests ---');

    // 9. A student can edit their own report
    const editRes = await fetch(`${baseUrl}/items/${createdLostId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${student1Token}`,
      },
      body: JSON.stringify({
        title: 'Lost Leather Backpack (Black) - Updated',
        description: 'Updated: Has two red keychains attached.',
      }),
    });
    const editData = await editRes.json();
    assert(
      editRes.status === 200 && editData.item.title.includes('Updated'),
      '9. A student can edit their own report'
    );

    // Register second student
    const reg2Res = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Student Beta',
        email: 'teststudent2@campus.edu',
        password: 'Password@123',
        confirmPassword: 'Password@123',
      }),
    });
    const reg2Data = await reg2Res.json();
    const student2Token = reg2Data.token;

    // 10. A student cannot edit or delete another student's report
    const unauthorizedEditRes = await fetch(`${baseUrl}/items/${createdLostId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${student2Token}`,
      },
      body: JSON.stringify({ title: 'Hacked Title' }),
    });
    const unauthorizedDelRes = await fetch(`${baseUrl}/items/${createdLostId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${student2Token}`,
      },
    });
    assert(
      unauthorizedEditRes.status === 403 && unauthorizedDelRes.status === 403,
      '10. A student CANNOT edit or delete another student\'s report (403 Forbidden)'
    );

    // 11. A student cannot access the admin dashboard
    const adminDashRes = await fetch(`${baseUrl}/dashboard/admin`, {
      headers: {
        Authorization: `Bearer ${student1Token}`,
      },
    });
    assert(
      adminDashRes.status === 403,
      '11. A student CANNOT access administrator dashboard (403 Forbidden)'
    );

    // 12. An administrator can moderate & delete reports
    const adminLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@campus.edu',
        password: 'Admin@12345',
      }),
    });
    const adminLoginData = await adminLoginRes.json();
    const adminToken = adminLoginData.token;

    const adminStatsRes = await fetch(`${baseUrl}/dashboard/admin`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    const adminStatsData = await adminStatsRes.json();

    const adminDelRes = await fetch(`${baseUrl}/items/${createdLostId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    assert(
      adminStatsRes.status === 200 &&
        adminStatsData.stats &&
        adminDelRes.status === 200,
      '12. An administrator can access admin stats and moderate/delete reports'
    );

    console.log('\n--- 4. Validation & Edge Cases Tests ---');

    // 13. Invalid input produces a clear error
    const badInputRes = await fetch(`${baseUrl}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${student1Token}`,
      },
      body: JSON.stringify({
        title: '',
        category: 'InvalidCategoryXYZ',
      }),
    });
    assert(badInputRes.status === 400, '13. Invalid input produces a clear 400 Bad Request error');

    // 14. Missing or invalid item IDs are handled properly
    const badIdRes = await fetch(`${baseUrl}/items/invalid-object-id-123`);
    assert(badIdRes.status === 404, '14. Invalid ObjectId format is safely caught and returns 404 Not Found');

    // 15. Empty search results return empty array with 200
    const emptySearchRes = await fetch(`${baseUrl}/items?search=TermThatMatchesNoReport12345`);
    const emptySearchData = await emptySearchRes.json();
    assert(
      emptySearchRes.status === 200 && emptySearchData.items.length === 0,
      '15. Empty search results return zero count and empty array cleanly'
    );

    // 16. Health check responds operational
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = await healthRes.json();
    assert(
      healthRes.status === 200 && healthData.status === 'ok',
      '16. Health check endpoint responds operational'
    );

    // 17. Student dashboard calculates correct personal statistics
    const studentDashRes = await fetch(`${baseUrl}/dashboard/student`, {
      headers: {
        Authorization: `Bearer ${student1Token}`,
      },
    });
    const studentDashData = await studentDashRes.json();
    assert(
      studentDashRes.status === 200 && studentDashData.stats.totalReports >= 1,
      '17. Student dashboard calculates authentic personal statistics'
    );

    console.log('\n====================================================');
    console.log(`   TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================\n');

    server.close();
    await disconnectDB();

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.error('Fatal test error:', error);
    if (server) server.close();
    process.exit(1);
  }
};

runTests();
