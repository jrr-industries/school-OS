import { ROLES } from '@schoolos/constants/roles';

interface UserInfo {
  id: string;
  schoolId: string;
  isSuperAdmin: boolean;
  roles: { role: { slug: string } }[];
}

interface TargetUser {
  id: string;
  schoolId: string;
  isSuperAdmin: boolean;
  roles: { role: { slug: string } }[];
}

function getPrimaryRole(user: UserInfo): string {
  if (user.isSuperAdmin) return 'super_admin';
  for (const r of user.roles) {
    const slug = r.role.slug;
    if (Object.values(ROLES).includes(slug as any)) return slug;
  }
  return 'student';
}

function normalizeRole(slug: string): string {
  const lookup: Record<string, string> = {
    super_admin: 'super_admin',
    school_owner: 'school_admin',
    admin: 'school_admin',
    principal: 'principal',
    vice_principal: 'vice_principal',
    teacher: 'teacher',
    class_teacher: 'class_teacher',
    student: 'student',
    parent: 'parent',
    hr: 'hr',
    accountant: 'accountant',
    office_staff: 'office_staff',
    it_support: 'it_support',
    transport_manager: 'transport_manager',
    driver: 'driver',
    hostel_warden: 'hostel_warden',
    hostel_student: 'hostel_student',
    librarian: 'office_staff',
    receptionist: 'office_staff',
    support: 'it_support',
  };
  return lookup[slug] ?? slug;
}

const COMMUNICATION_MATRIX: Record<string, string[]> = {
  super_admin: ['school_admin', 'super_admin'],
  school_admin: [
    'super_admin', 'principal', 'vice_principal', 'teacher', 'class_teacher',
    'student', 'parent', 'hr', 'accountant', 'office_staff', 'it_support',
    'transport_manager', 'driver', 'hostel_warden',
  ],
  principal: ['school_admin', 'vice_principal', 'teacher', 'hr', 'accountant', 'office_staff'],
  vice_principal: ['school_admin', 'principal', 'teacher', 'class_teacher'],
  teacher: ['school_admin', 'principal', 'vice_principal', 'teacher', 'class_teacher'],
  class_teacher: ['school_admin', 'principal', 'vice_principal', 'teacher', 'student', 'parent'],
  student: ['class_teacher', 'teacher'],
  parent: ['class_teacher', 'teacher'],
  hr: ['school_admin', 'principal', 'accountant', 'office_staff', 'it_support'],
  accountant: ['school_admin', 'principal', 'hr', 'office_staff'],
  office_staff: ['school_admin', 'principal', 'hr', 'accountant', 'it_support'],
  it_support: ['school_admin', 'office_staff'],
  transport_manager: ['school_admin', 'driver'],
  driver: ['school_admin', 'transport_manager'],
  hostel_warden: ['school_admin', 'principal', 'hostel_student'],
  hostel_student: ['school_admin', 'hostel_warden'],
};

function roleCanMessage(role: string, canMessageRoles: string[]): boolean {
  return canMessageRoles.includes(role);
}

export function canMessage(sender: UserInfo, receiver: TargetUser): { allowed: boolean; reason?: string } {
  if (sender.isSuperAdmin && receiver.isSuperAdmin) {
    return { allowed: true };
  }

  if (sender.schoolId !== receiver.schoolId && !sender.isSuperAdmin) {
    return { allowed: false, reason: 'Cross-school messaging is not allowed' };
  }

  if (sender.isSuperAdmin && !receiver.isSuperAdmin) {
    const receiverRole = normalizeRole(getPrimaryRole(receiver));
    if (receiverRole !== 'school_admin') {
      return { allowed: false, reason: 'Super Admin can only message School Admins' };
    }
    return { allowed: true };
  }

  if (receiver.isSuperAdmin) {
    const senderRole = normalizeRole(getPrimaryRole(sender));
    if (senderRole !== 'school_admin') {
      return { allowed: false, reason: 'Only School Admins can message Super Admins' };
    }
    return { allowed: true };
  }

  const senderRole = getPrimaryRole(sender);
  const receiverRole = getPrimaryRole(receiver);
  const normalizedSender = normalizeRole(senderRole);
  const normalizedReceiver = normalizeRole(receiverRole);

  const allowedTargets = COMMUNICATION_MATRIX[normalizedSender];
  if (!allowedTargets) {
    return { allowed: false, reason: `Role ${senderRole} cannot start conversations` };
  }

  if (!roleCanMessage(normalizedReceiver, allowedTargets)) {
    return { allowed: false, reason: `${senderRole} cannot message ${receiverRole}` };
  }

  return { allowed: true };
}

export function canViewConversation(
  user: UserInfo,
  conversation: { schoolId: string; participants: { userId: string; leftAt: Date | null }[] },
): { allowed: boolean; reason?: string } {
  if (user.isSuperAdmin) {
    return { allowed: true };
  }

  if (conversation.schoolId !== user.schoolId) {
    return { allowed: false, reason: 'Conversation belongs to a different school' };
  }

  const roles = user.roles.map((r) => r.role.slug);
  const isSchoolAdmin = roles.includes('admin') || roles.includes('school_owner');

  if (isSchoolAdmin) {
    return { allowed: true };
  }

  const isParticipant = conversation.participants.some(
    (p) => p.userId === user.id && p.leftAt === null,
  );
  if (!isParticipant) {
    return { allowed: false, reason: 'You are not a participant in this conversation' };
  }

  return { allowed: true };
}

export function canJoinConversation(
  user: UserInfo,
  conversation: { schoolId: string; participants: { userId: string; leftAt: Date | null }[] },
): { allowed: boolean; reason?: string } {
  if (conversation.schoolId !== user.schoolId && !user.isSuperAdmin) {
    return { allowed: false, reason: 'Cross-school conversations are not allowed' };
  }

  const existingParticipant = conversation.participants.find(
    (p) => p.userId === user.id && p.leftAt === null,
  );
  if (existingParticipant) {
    return { allowed: true };
  }

  const otherParticipants = conversation.participants.filter(
    (p) => p.userId !== user.id && p.leftAt === null,
  );

  for (const other of otherParticipants) {
    const tempOther: TargetUser = { id: other.userId, schoolId: conversation.schoolId, isSuperAdmin: false, roles: [] };
    const tempSender: UserInfo = { ...user };
    const check = canMessage(tempSender, tempOther);
    if (!check.allowed) {
      if (otherParticipants.length === 1) {
        return { allowed: false, reason: check.reason };
      }
    }
  }

  return { allowed: true };
}

export function isSameSchool(
  user: { schoolId: string; isSuperAdmin: boolean },
  targetSchoolId: string,
): boolean {
  if (user.isSuperAdmin) return true;
  return user.schoolId === targetSchoolId;
}

export function getVisibleSchoolIds(
  user: { schoolId: string; isSuperAdmin: boolean },
): string[] | null {
  if (user.isSuperAdmin) return null;
  return [user.schoolId];
}

export function canSuperAdminView(
  user: { isSuperAdmin: boolean },
  conversation: { participants: { userId: string; leftAt: Date | null }[] },
): boolean {
  if (!user.isSuperAdmin) return false;
  const hasSchoolAdmin = conversation.participants.some(
    (p) => p.leftAt === null,
  );
  return hasSchoolAdmin;
}
