import { userService } from '../services/userService';
import { departmentService } from '../services/departmentService';
import { locationService } from '../services/locationService';
import { teamService } from '../services/teamService';
import { vendorService } from '../services/vendorService';

export const entityResolver = {
  getUserName(userId) {
    if (!userId) return 'Unassigned';
    const u = userService.getUserById(userId);
    return u ? u.name : userId;
  },

  getDepartmentName(deptId) {
    if (!deptId) return 'N/A';
    const d = departmentService.getDepartmentById(deptId);
    return d ? `${d.name} (${d.code})` : deptId;
  },

  getLocationName(locId) {
    if (!locId) return 'N/A';
    const l = locationService.getLocationById(locId);
    return l ? `${l.name}` : locId;
  },

  getTeamName(teamId) {
    if (!teamId) return 'Unassigned';
    const t = teamService.getTeamById(teamId);
    return t ? t.name : teamId;
  },

  getVendorName(vendorId) {
    if (!vendorId) return 'N/A';
    const v = vendorService.getVendorById(vendorId);
    return v ? v.name : vendorId;
  }
};
