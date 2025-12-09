// Script to baseline existing database with migrations
// Run this once to mark all existing migrations as applied

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, 'migrations');

// Get all migration directories
const migrations = fs.readdirSync(migrationsDir)
  .filter(f => {
    const fullPath = path.join(migrationsDir, f);
    return fs.statSync(fullPath).isDirectory() && f.match(/^\d{14}_/);
  })
  .sort();

console.log(`Found ${migrations.length} migrations to baseline:`);
migrations.forEach(m => console.log(`  - ${m}`));

// Mark each migration as applied
for (const migration of migrations) {
  console.log(`\nMarking ${migration} as applied...`);
  try {
    execSync(`npx prisma migrate resolve --applied ${migration}`, { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    console.log(`✓ ${migration} marked as applied`);
  } catch (error) {
    console.error(`✗ Failed to mark ${migration}: ${error.message}`);
  }
}

console.log('\n✓ Baseline complete!');
