'use client';

import { use, useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent, Card, CardContent, CardHeader, CardTitle } from '@schoolos/ui';
import { StudentProfileHeader } from '@/features/students/components/student-profile-header';
import { StudentTimeline } from '@/features/students/components/student-timeline';
import { DateUtils } from '@schoolos/utils';
import { Mail, Phone, MapPin, Droplets, Heart, Stethoscope, AlertTriangle } from 'lucide-react';

interface StudentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function StudentDetailPage({ params }: StudentDetailPageProps) {
  const { id } = use(params);
  const [student, setStudent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`/api/students/${id}?schoolId=current-school-id`);
        const data = await response.json();

        if (data.success) {
          setStudent(data.data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (!student) {
    return <div className="py-12 text-center text-muted-foreground">Student not found</div>;
  }

  const guardians = student.guardians as any[] | undefined;
  const addresses = student.addresses as any[] | undefined;
  const medical = student.medical as Record<string, any> | undefined;
  const documents = student.documents as any[] | undefined;
  const promotions = student.promotions as any[] | undefined;
  const emergencyContacts = student.emergencyContacts as any[] | undefined;

  const timelineEvents = [
    {
      id: 'admission',
      type: 'admission' as const,
      title: 'Student Admitted',
      description: `Admitted with number ${student.admissionNumber as string}`,
      date: student.admissionDate as string,
    },
    ...(promotions?.map((p) => ({
      id: p.id as string,
      type: 'promotion' as const,
      title: 'Promoted',
      description: `From ${(p.fromClass as Record<string, string>)?.name ?? ''} to ${(p.toClass as Record<string, string>)?.name ?? ''}`,
      date: p.createdAt as string,
    })) ?? []),
  ];

  return (
    <div className="space-y-6">
      <StudentProfileHeader student={student as Record<string, unknown> as any} />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="guardians">Guardians</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Personal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date of Birth</span>
                  <span>{DateUtils.formatShort(student.dateOfBirth as string)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gender</span>
                  <span className="capitalize">{student.gender as string}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Blood Group</span>
                  <span>{(student.bloodGroup as string)?.replace('_', ' ') ?? '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Religion</span>
                  <span>{student.religion as string ?? '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nationality</span>
                  <span>{student.nationality as string ?? '-'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Academic Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Admission No</span>
                  <span className="font-medium">{student.admissionNumber as string}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Roll Number</span>
                  <span>{student.rollNumber as string ?? '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">EMIS Number</span>
                  <span>{student.emisNumber as string ?? '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Class</span>
                  <span>{(student.class as Record<string, string>)?.name ?? '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Section</span>
                  <span>{(student.section as Record<string, string>)?.name ?? '-'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Profile Complete</span>
                  <span>{student.profileComplete as number ?? 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="capitalize">{student.status as string}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Scholarship</span>
                  <span>{student.isScholarship ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">House</span>
                  <span>{(student.house as Record<string, string>)?.name ?? '-'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="guardians" className="space-y-4">
          {guardians && guardians.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {guardians.map((guardian, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium capitalize">
                          {guardian.firstName as string} {guardian.lastName as string}
                        </p>
                        <p className="text-sm capitalize text-muted-foreground">
                          {guardian.relationship as string}
                        </p>
                      </div>
                      {guardian.isPrimary && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                          Primary
                        </span>
                      )}
                    </div>
                    <div className="mt-3 space-y-1 text-sm">
                      {guardian.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {guardian.phone as string}
                        </div>
                      )}
                      {guardian.email && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {guardian.email as string}
                        </div>
                      )}
                      {guardian.occupation && (
                        <p className="text-muted-foreground">Occupation: {guardian.occupation as string}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground">No guardians recorded</p>
          )}

          {emergencyContacts && emergencyContacts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <p className="text-sm font-medium">{contact.name as string}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {contact.relationship as string}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <p>{contact.phone as string}</p>
                      {contact.alternatePhone && (
                        <p className="text-xs text-muted-foreground">{contact.alternatePhone as string}</p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="medical" className="space-y-4">
          {medical ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Heart className="h-4 w-4" />
                    Vital Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Blood Group</span>
                    <span>{(medical.bloodGroup as string)?.replace('_', ' ') ?? '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Height</span>
                    <span>{medical.height as string ? `${medical.height} cm` : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Weight</span>
                    <span>{medical.weight as string ? `${medical.weight} kg` : '-'}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Stethoscope className="h-4 w-4" />
                    Medical Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {medical.allergies && (
                    <div>
                      <span className="text-muted-foreground">Allergies:</span>
                      <p>{medical.allergies as string}</p>
                    </div>
                  )}
                  {medical.medicalConditions && (
                    <div>
                      <span className="text-muted-foreground">Conditions:</span>
                      <p>{medical.medicalConditions as string}</p>
                    </div>
                  )}
                  {medical.medications && (
                    <div>
                      <span className="text-muted-foreground">Medications:</span>
                      <p>{medical.medications as string}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {(medical.doctorName || medical.insuranceProvider) && (
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                      <Droplets className="h-4 w-4" />
                      Healthcare Provider
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
                    {medical.doctorName && (
                      <div>
                        <span className="text-muted-foreground">Doctor:</span>
                        <p>{medical.doctorName as string}</p>
                        {medical.doctorPhone && <p>{medical.doctorPhone as string}</p>}
                      </div>
                    )}
                    {medical.insuranceProvider && (
                      <div>
                        <span className="text-muted-foreground">Insurance:</span>
                        <p>{medical.insuranceProvider as string}</p>
                        {medical.insuranceNumber && <p>{medical.insuranceNumber as string}</p>}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground">No medical records</p>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          {documents && documents.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {documents.map((doc, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <p className="font-medium capitalize">{doc.title as string}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {(doc.category as string)?.replace(/_/g, ' ')}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      {doc.isVerified ? (
                        <span className="text-emerald-600">Verified</span>
                      ) : (
                        <span className="text-amber-600">Pending</span>
                      )}
                      {doc.fileSize && <span>{(doc.fileSize as number / 1024).toFixed(1)} KB</span>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground">No documents uploaded</p>
          )}
        </TabsContent>

        <TabsContent value="address" className="space-y-4">
          {addresses && addresses.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {addresses.map((addr, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium capitalize">{addr.type as string} Address</p>
                    </div>
                    <div className="mt-2 space-y-1 text-sm">
                      <p>{addr.addressLine1 as string}</p>
                      {addr.addressLine2 && <p>{addr.addressLine2 as string}</p>}
                      <p>
                        {addr.city as string}, {addr.state as string} - {addr.postalCode as string}
                      </p>
                      <p className="text-muted-foreground">{addr.country as string}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground">No addresses recorded</p>
          )}
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardContent className="pt-6">
              <StudentTimeline events={timelineEvents} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
