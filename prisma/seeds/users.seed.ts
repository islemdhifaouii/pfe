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
    create: {
      name: 'admin',
      description: 'System Administrator - Full access',
      permissions: ['*:*'],
    },
  });

  const managerRole = await prisma.role.upsert({
    where: { name: 'manager' },
    update: {},
    create: {
      name: 'manager',
      description: 'Manager - Team management access',
      permissions: ['employees:read', 'leaves:approve', 'tickets:assign'],
    },
  });

  const employeeRole = await prisma.role.upsert({
    where: { name: 'employee' },
    update: {},
    create: {
      name: 'employee',
      description: 'Employee - Basic user access',
      permissions: ['profile:manage', 'leaves:create', 'tickets:create'],
    },
  });

  console.log('✅ Roles created');

  // 2️⃣ Admin User
  console.log('👤 Creating admin user...');
  const hashedPassword = await bcrypt.hash('Admin123!', 10);

  await prisma.user.upsert({
    where: { email: 'admin@virtide.com' },
    update: {},
    create: {
      email: 'admin@virtide.com',
      passwordHash: hashedPassword,
      roleId: adminRole.id,
      isActive: true,
      employee: {
        create: {
          firstName: 'Admin',
          lastName: 'System',
          employeeCode: 'ADMIN001',
          department: 'IT',
          position: 'System Administrator',
        },
      },
    },
  });

  console.log(' Admin user created');

  // 3️Leave Policies
  console.log('📅 Creating leave policies...');
  const leavePolicies = [
    { name: 'Annual Leave', description: 'Regular paid vacation', daysPerYear: 25, requiresApproval: true },
    { name: 'Sick Leave', description: 'Medical leave', daysPerYear: 10, requiresApproval: true },
    { name: 'Family Leave', description: 'Family-related absence', daysPerYear: 5, requiresApproval: true },
    { name: 'Unpaid Leave', description: 'Unpaid time off', daysPerYear: 0, requiresApproval: true },
  ];

  for (const policy of leavePolicies) {
    await prisma.leavePolicy.upsert({
      where: { name: policy.name },
      update: {},
      create: policy,
    });
  }

  console.log(' Leave policies created');

  // 4️Ticket Categories
  console.log(' Creating ticket categories...');
  const ticketCategories = [
    { name: 'IT Support', description: 'Hardware, software, network issues', slaHours: 4 },
    { name: 'HR', description: 'Human resources questions', slaHours: 24 },
    { name: 'Facility', description: 'Building, equipment maintenance', slaHours: 48 },
    { name: 'Finance', description: 'Payroll, expenses questions', slaHours: 24 },
  ];

  for (const category of ticketCategories) {
    await prisma.ticketCategory.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('Ticket categories created');

  // 5 Job Titles
  console.log(' Creating job titles...');
  const jobTitles = [
    { title: 'CEO', level: 1, department: 'Executive' },
    { title: 'CTO', level: 2, department: 'Executive' },
    { title: 'HR Director', level: 2, department: 'Human Resources' },
    { title: 'IT Manager', level: 3, department: 'IT' },
    { title: 'Senior Developer', level: 4, department: 'IT' },
    { title: 'Developer', level: 5, department: 'IT' },
    { title: 'HR Specialist', level: 4, department: 'Human Resources' },
  ];

  for (const jobTitle of jobTitles) {
    await prisma.jobTitle.upsert({
      where: { title: jobTitle.title },
      update: {},
      create: jobTitle,
    });
  }

  console.log(' Job titles created');

  // 6️ Tools
  console.log('🛠️ Creating tools...');
  const tools = [
    { name: 'Microsoft Teams', category: 'Communication', link: 'https://teams.microsoft.com', description: 'Team collaboration' },
    { name: 'Jira', category: 'Project Management', link: 'https://jira.company.com', description: 'Project tracking' },
    { name: 'Confluence', category: 'Documentation', link: 'https://confluence.company.com', description: 'Wiki and documentation' },
    { name: 'GitLab', category: 'Development', link: 'https://gitlab.company.com', description: 'Code repository and CI/CD' },
  ];

  for (const tool of tools) {
    await prisma.tool.upsert({
      where: { name: tool.name },
      update: {},
      create: tool,
    });
  }

  console.log(' Tools created');

  console.log(' Seeding completed!');
}