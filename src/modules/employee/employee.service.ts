import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDTO } from './dto/create-employee.dto';
import { UpdateEmployeeDTO } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateEmployeeDTO) {
    return this.prisma.employee.create({
      data: {
        fullName: data.fullName,
        department: data.department,
        status: data.status,
        user: {
          connect: { id: data.userId }, // ✅ connect user relation
        },
        manager: data.managerId
          ? { connect: { id: data.managerId } } // ✅ optional
          : undefined,
        jobTitle: data.jobTitleId
          ? { connect: { id: data.jobTitleId } } // ✅ optional
          : undefined,
      },
    });
  }

  async findAll() {
    return this.prisma.employee.findMany({
      include: {
        user: true,
        manager: true,
        jobTitle: true,
      },
    });
  }

  async findOne(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        user: true,
        manager: true,
        jobTitle: true,
      },
    });

    if (!employee) throw new NotFoundException('Employee not found');

    return employee;
  }

  async update(id: string, data: UpdateEmployeeDTO) {
    return this.prisma.employee.update({
      where: { id },
      data: {
        fullName: data.fullName,
        department: data.department,
        status: data.status,
        manager: data.managerId
          ? { connect: { id: data.managerId } }
          : undefined,
        jobTitle: data.jobTitleId
          ? { connect: { id: data.jobTitleId } }
          : undefined,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.employee.delete({
      where: { id },
    });
  }
}