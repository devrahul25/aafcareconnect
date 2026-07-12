import { RolesRepository } from './roles.repository';

export class RolesService {
  static async getRoles(organization_id: string) {
    const roles = await RolesRepository.findAllByOrg(organization_id);
    return roles.map(role => ({
      id: role.id,
      name: role.name,
      description: role.description,
      is_system: role.is_system,
      user_count: role._count.user_roles,
      permission_count: role.permissions.length,
      created_at: role.created_at,
      updated_at: role.updated_at,
      permissions: role.permissions.map(rp => rp.permission_id)
    }));
  }

  static async getRole(id: string, organization_id: string) {
    const role = await RolesRepository.findById(id, organization_id);
    if (!role) throw new Error('Role not found');
    
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      is_system: role.is_system,
      permissions: role.permissions.map(rp => rp.permission.resource + ':' + rp.permission.action)
    };
  }

  static async createRole(organization_id: string, name: string, description: string, permission_ids: string[]) {
    return RolesRepository.createRole({
      organization_id,
      name,
      description,
      is_system: false,
      permission_ids
    });
  }

  static async duplicateRole(id: string, organization_id: string, newName: string) {
    const existingRole = await RolesRepository.findById(id, organization_id);
    if (!existingRole) throw new Error('Role not found');

    const permission_ids = existingRole.permissions.map(p => p.permission_id);

    return RolesRepository.createRole({
      organization_id,
      name: newName,
      description: existingRole.description ? existingRole.description + ' (Copy)' : 'Copied role',
      is_system: false,
      permission_ids
    });
  }

  static async updateRole(id: string, organization_id: string, name: string, description: string, permission_ids: string[]) {
    // Basic protection against renaming built-in Org Admin
    const existing = await RolesRepository.findById(id, organization_id);
    if (!existing) throw new Error('Role not found');
    
    if (existing.is_system && name !== existing.name) {
      throw new Error('Cannot rename system roles');
    }

    return RolesRepository.updateRole(id, organization_id, {
      name: existing.is_system ? existing.name : name,
      description,
      permission_ids
    });
  }

  static async deleteRole(id: string, organization_id: string) {
    return RolesRepository.deleteRole(id, organization_id);
  }
}
