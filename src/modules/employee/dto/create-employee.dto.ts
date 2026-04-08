import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateEmployeeDTO {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsString()
  @IsNotEmpty() // make it required to match Prisma schema
  status: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsOptional()
  managerId?: string;

  @IsString()
  @IsOptional()
  jobTitleId?: string;
}