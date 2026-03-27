// prisma/seeds/users.seeds.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function seed() {
  console.log(' Starting seeding...');

  // 1️ Roles
  console.log('📝 Creating roles...');
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' },
  });

  const managerRole = await prisma.role.upsert({
    where: { name: 'manager' },
    update: {},
    create: { name: 'manager' },
  });

  const employeeRole = await prisma.role.upsert({
    where: { name: 'employee' },
    update: {},
    create: { name: 'employee' },
  });

  console.log('✅ Roles created');

  // 2️⃣ Tools
  console.log('🛠️ Creating tools...');
  const toolsData = [
    { name: 'Microsoft Teams', category: 'Communication' },
    { name: 'Jira', category: 'Project Management' },
    { name: 'Confluence', category: 'Documentation' },
    { name: 'GitLab', category: 'Development' },
  ];

  const tools = [];
  for (const tool of toolsData) {
    let existing = await prisma.tool.findFirst({ where: { name: tool.name } });
    if (!existing) {
      existing = await prisma.tool.create({
        data: {
          name: tool.name,
          category: tool.category,
          roles: { connect: [{ id: adminRole.id }] },
        },
      });
    }
    tools.push(existing);
  }
  console.log('✅ Tools created');

  // 3️⃣ Job Titles
  console.log('💼 Creating job titles...');
  const jobTitlesData = [
    { title: 'CEO', level: 'C-Level' },
    { title: 'CTO', level: 'C-Level' },
    { title: 'HR Director', level: 'Director' },
    { title: 'IT Manager', level: 'Manager' },
    { title: 'Senior Developer', level: 'Senior' },
    { title: 'Developer', level: 'Junior' },
    { title: 'HR Specialist', level: 'Specialist' },
  ];

  const jobTitleMap: Record<string, string> = {};
  for (const jt of jobTitlesData) {
    let existing = await prisma.jobTitle.findFirst({ where: { title: jt.title } });
    if (!existing) {
      existing = await prisma.jobTitle.create({
        data: { title: jt.title, level: jt.level },
      });
    }
    jobTitleMap[jt.title] = existing.id;
  }
  console.log('✅ Job titles created');

  // 4️⃣ Admin User + Employee
  console.log('👤 Creating admin user...');
  const hashedPassword = await bcrypt.hash('Admin123!', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@virtide.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@virtide.com',
      passwordHash: hashedPassword,
      roles: { connect: [{ id: adminRole.id }] },
      employee: {
        create: {
          fullName: 'Admin System',
          department: 'IT',
          status: 'active',
          jobTitleId: jobTitleMap['IT Manager'] ?? undefined,
          onboardingChecklist: {
            create: { completed: true },
          },
        },
      },
    },
    include: { employee: true },
  });
  console.log('✅ Admin user created');

  // 5️⃣ Manager User + Employee
  console.log('👤 Creating manager user...');
  const managerHashedPassword = await bcrypt.hash('Manager123!', 10);

  const managerUser = await prisma.user.upsert({
    where: { email: 'manager@virtide.com' },
    update: {},
    create: {
      username: 'manager',
      email: 'manager@virtide.com',
      passwordHash: managerHashedPassword,
      roles: { connect: [{ id: managerRole.id }] },
      employee: {
        create: {
          fullName: 'John Manager',
          department: 'Human Resources',
          status: 'active',
          jobTitleId: jobTitleMap['HR Director'] ?? undefined,
          onboardingChecklist: {
            create: { completed: true },
          },
        },
      },
    },
    include: { employee: true },
  });
  console.log('✅ Manager user created');

  // 6️⃣ Sample Employee User
  console.log('👤 Creating sample employee user...');
  const employeeHashedPassword = await bcrypt.hash('Employee123!', 10);

  const sampleUser = await prisma.user.upsert({
    where: { email: 'employee@virtide.com' },
    update: {},
    create: {
      username: 'employee',
      email: 'employee@virtide.com',
      passwordHash: employeeHashedPassword,
      roles: { connect: [{ id: employeeRole.id }] },
      employee: {
        create: {
          fullName: 'Jane Employee',
          department: 'IT',
          status: 'active',
          jobTitleId: jobTitleMap['Developer'] ?? undefined,
          managerId: managerUser.employee?.id,
          onboardingChecklist: {
            create: { completed: false },
          },
          leaveRequests: {
            create: [
              {
                startDate: new Date('2025-08-01'),
                endDate: new Date('2025-08-05'),
                status: 'pending',
              },
            ],
          },
          tickets: {
            create: [
              {
                title: 'Cannot access GitLab',
                status: 'open',
                priority: 'high',
              },
            ],
          },
          documents: {
            create: [
              { title: 'Employment Contract' },
              { title: 'NDA Agreement' },
            ],
          },
          payrollRecords: {
            create: [
              {
                period: '2025-07',
                netAmount: 3200.0,
              },
            ],
          },
        },
      },
    },
  });
  console.log('✅ Sample employee user created');

  // 7️⃣ Notifications
  console.log('🔔 Creating notifications...');
  await prisma.notification.createMany({
    data: [
      { message: 'Welcome to Virtide!', userId: adminUser.id },
      { message: 'You have a pending leave request to review.', userId: managerUser.id },
      { message: 'Your onboarding checklist is incomplete.', userId: sampleUser.id },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Notifications created');

  // 8️⃣ Audit Logs
  console.log('📋 Creating audit logs...');
  await prisma.auditLog.createMany({
    data: [
      { action: 'USER_CREATED', userId: adminUser.id },
      { action: 'USER_CREATED', userId: managerUser.id },
      { action: 'USER_CREATED', userId: sampleUser.id },
    ],
  });
  console.log('✅ Audit logs created');

  console.log('🎉 Seeding completed!');
}