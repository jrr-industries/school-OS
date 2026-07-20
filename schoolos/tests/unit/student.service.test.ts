import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StudentService } from '../../apps/web/src/features/students/services/student.service';

vi.mock('@schoolos/database', () => ({
  prisma: {
    student: {
      create: vi.fn(),
      update: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
    studentPromotion: { create: vi.fn() },
    studentTransfer: { create: vi.fn() },
    studentArchive: { createMany: vi.fn() },
    $transaction: vi.fn((cb: Function) => cb(vi.fn())),
  },
  StudentRepository: vi.fn().mockImplementation(() => ({
    findById: vi.fn(),
    findByAdmissionNumber: vi.fn(),
    findAll: vi.fn(),
    getStudentStats: vi.fn(),
    softDelete: vi.fn(),
    bulkArchive: vi.fn(),
    bulkRestore: vi.fn(),
  })),
  ParentRepository: vi.fn(),
  AcademicYearRepository: vi.fn().mockImplementation(() => ({
    findCurrent: vi.fn(),
  })),
}));

vi.mock('@schoolos/utils', () => ({
  Logger: { info: vi.fn(), error: vi.fn() },
  IdUtils: { generate: vi.fn(() => 'test-id') },
}));

describe('StudentService', () => {
  let service: StudentService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new StudentService();
  });

  it('should create a student', async () => {
    const { prisma } = await import('@schoolos/database');
    const mockStudent = {
      id: 'test-id',
      admissionNumber: 'STU001',
      firstName: 'John',
      lastName: 'Doe',
      schoolId: 'school-1',
    };

    (prisma.student.create as any).mockResolvedValue(mockStudent);

    const result = await service.create(
      {
        admissionNumber: 'STU001',
        firstName: 'John',
        lastName: 'Doe',
        gender: 'male',
        dateOfBirth: '2010-01-01T00:00:00.000Z',
        admissionDate: '2024-06-01T00:00:00.000Z',
      },
      'school-1',
      'user-1',
    );

    expect(result).toEqual(mockStudent);
    expect(prisma.student.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          admissionNumber: 'STU001',
          schoolId: 'school-1',
          createdBy: 'user-1',
        }),
      }),
    );
  });

  it('should throw on duplicate admission number', async () => {
    const { StudentRepository } = await import('@schoolos/database');
    const mockRepo = vi.mocked(StudentRepository).mock.results[0]?.value;

    mockRepo.findByAdmissionNumber.mockResolvedValue({ id: 'existing' });

    await expect(
      service.create(
        {
          admissionNumber: 'STU001',
          firstName: 'John',
          lastName: 'Doe',
          gender: 'male',
          dateOfBirth: '2010-01-01T00:00:00.000Z',
          admissionDate: '2024-06-01T00:00:00.000Z',
        },
        'school-1',
        'user-1',
      ),
    ).rejects.toThrow(/already exists/);
  });

  it('should get student stats', async () => {
    const { StudentRepository } = await import('@schoolos/database');
    const mockRepo = vi.mocked(StudentRepository).mock.results[0]?.value;

    const mockStats = {
      total: 100,
      active: 80,
      byGender: [{ gender: 'male', _count: 55 }, { gender: 'female', _count: 45 }],
      byStatus: [{ status: 'active', _count: 80 }, { status: 'inactive', _count: 20 }],
    };

    mockRepo.getStudentStats.mockResolvedValue(mockStats);

    const result = await service.getStats('school-1');
    expect(result).toEqual(mockStats);
  });

  it('should soft delete a student', async () => {
    const { StudentRepository } = await import('@schoolos/database');
    const mockRepo = vi.mocked(StudentRepository).mock.results[0]?.value;

    mockRepo.softDelete.mockResolvedValue({ id: 'test-id' });

    const result = await service.softDelete('test-id', 'school-1', 'user-1');
    expect(result).toEqual({ id: 'test-id' });
  });
});
