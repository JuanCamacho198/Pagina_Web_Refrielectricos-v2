import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('entity') entity?: string,
    @Query('userId') userId?: string,
    @Query('action') action?: string,
  ) {
    const pageNum = parseInt(page || '1', 10);
    const limitNum = parseInt(limit || '50', 10);
    const skip = (pageNum - 1) * limitNum;

    return this.auditLogsService.findAll({
      skip,
      take: limitNum,
      entity,
      userId,
      action,
    });
  }

  @Get('entity')
  async findByEntity(
    @Query('entity') entity: string,
    @Query('entityId') entityId: string,
  ) {
    return this.auditLogsService.findByEntity(entity, entityId);
  }

  @Get('user')
  async findByUser(
    @Query('userId') userId: string,
    @Query('limit') limit?: string,
  ) {
    const limitNum = parseInt(limit || '100', 10);
    return this.auditLogsService.findByUser(userId, limitNum);
  }
}
