import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDTO } from './dto/create-employee.dto';
import { UpdateEmployeeDTO } from './dto/update-employee.dto';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  // Create a new employee
  @Post()
  async create(@Body() data: CreateEmployeeDTO) {
    return this.employeeService.create(data);
  }

  // Get all employees
  @Get()
  async findAll() {
    return this.employeeService.findAll();
  }

  // Get a single employee by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const employee = await this.employeeService.findOne(id);
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  // Update an employee
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateEmployeeDTO) {
    return this.employeeService.update(id, data);
  }

  // Delete an employee
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }
}