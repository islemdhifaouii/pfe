import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateLeaveDTO, UpdateLeaveStatusDTO } from './dto/leave.dto';
import { LeaveService } from './leave.service';
import { JwtAuthGuard } from '../auth/auth.jwt.guard';

@ApiTags('leave')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  @ApiOperation({ description: 'Create a new leave request' })
  async create(@Body() data: CreateLeaveDTO) {
    return this.leaveService.create(data);
  }

  @Get()
  @ApiOperation({ description: 'List all leave requests' })
  async findAll() {
    return this.leaveService.findAll();
  }

  @Get(':id')
  @ApiOperation({ description: 'Get a single leave request' })
  async findOne(@Param('id') id: string) {
    return this.leaveService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ description: 'Update leave request status (APPROVED/REJECTED)' })
  async updateStatus(
    @Param('id') id: string,
    @Body() data: UpdateLeaveStatusDTO,
  ) {
    return this.leaveService.updateStatus(id, data.status);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Delete a leave request' })
  async remove(@Param('id') id: string) {
    return this.leaveService.remove(id);
  }
}
