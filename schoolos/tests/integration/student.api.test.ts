import { describe, it, expect } from 'vitest';

describe('Student API Integration', () => {
  const baseUrl = 'http://localhost:3000/api';

  it('should return health status', async () => {
    const response = await fetch(`${baseUrl}/health`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should require schoolId for student list', async () => {
    const response = await fetch(`${baseUrl}/students`);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it('should validate student creation input', async () => {
    const response = await fetch(`${baseUrl}/students?schoolId=test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBeDefined();
  });

  it('should require classId for sections list', async () => {
    const response = await fetch(`${baseUrl}/sections`);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error?.message).toContain('Class ID is required');
  });

  it('should require schoolId for academic years', async () => {
    const response = await fetch(`${baseUrl}/academic-years`);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it('should require schoolId for campuses', async () => {
    const response = await fetch(`${baseUrl}/campuses`);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it('should return paginated response structure', async () => {
    const response = await fetch(`${baseUrl}/students?schoolId=test-school`);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.meta).toBeDefined();
    expect(data.meta).toHaveProperty('page');
    expect(data.meta).toHaveProperty('limit');
    expect(data.meta).toHaveProperty('total');
    expect(data.meta).toHaveProperty('totalPages');
  });
});
