
import { seed } from './users.seed';

async function main() {
  try {
    await seed();
  } catch (e) {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  }
}

main();