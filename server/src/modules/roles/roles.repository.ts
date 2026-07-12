import { PrismaClient } from '@prisma/client';
import { prisma } from '../../config/database';

export class RolesRepository {
  static async findAllByOrg(organization_id: string) {
    return prisma.role.findMany({
      where: { organization_id },
      include: {
        _count: {
          select: { user_roles: true }
        },
        permissions: {
          include: {
            permission: true
          }
        }
      },
      orderBy: { created_at: 'asc' }
    });
  }

  static async findById(id: string, organization_id: string) {
    return prisma.role.findFirst({
      where: { id, organization_id },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    });
  }

  static async createRole(data: {
    organization_id: string;
    name: string;
    description?: string;
    is_system?: boolean;
    permission_ids: string[];
  }) {
    return prisma.$transaction(async (tx) => {
      const role = await tx.role.create({
        data: {
          organization_id: data.organization_id,
          name: data.name,
          description: data.description,
          is_system: data.is_system || false
        }
      });

      if (data.permission_ids && data.permission_ids.length > 0) {
        await tx.rolePermission.createMany({
          data: data.permission_ids.map(pid => ({
            role_id: role.id,
            permission_id: pid
          }))
        });
      }

      return role;
    });
  }

  static async updateRole(id: string, organization_id: string, data: {
    name?: string;
    description?: string;
    permission_ids?: string[];
  }) {
    return prisma.$transaction(async (tx) => {
      const role = await tx.role.findFirst({ where: { id, organization_id } });
      if (!role) throw new Error('Role not found');

      const updateData: any = {};
      if (data.name) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description;

      const updatedRole = await tx.role.update({
        where: { id },
        data: updateData
      });

      if (data.permission_ids) {
        // Delete old permissions
        await tx.rolePermission.deleteMany({
          where: { role_id: id }
        });
        
        // Add new permissions
        if (data.permission_ids.length > 0) {
          await tx.rolePermission.createMany({
            data: data.permission_ids.map(pid => ({
              role_id: id,
              permission_id: pid
            }))
          });
        }
      }

      return updatedRole;
    });
  }

  static async deleteRole(id: string, organization_id: string) {
    const role = await prisma.role.findFirst({ where: { id, organization_id } });
    if (!role) throw new Error('Role not found');
    if (role.is_system) throw new Error('Cannot delete system roles');

    return prisma.role.delete({
      where: { id }
    });
  }
}
