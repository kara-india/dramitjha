"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientSchema, PatientFormValues } from "../../schema";
import { usePatient, useUpdatePatient } from "../../queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditPatientPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: patient, isLoading } = usePatient(resolvedParams.id);
  const { mutateAsync: updatePatient, isPending } = useUpdatePatient();

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    values: patient as PatientFormValues,
  });

  const onSubmit = async (data: PatientFormValues) => {
    try {
      await updatePatient({ id: resolvedParams.id, data });
      router.push(`/patients/${resolvedParams.id}`);
    } catch (err) {
      // handled in mutation
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-[600px] w-full max-w-3xl mx-auto" />
      </div>
    );
  }

  if (!patient) {
    return <div>Patient not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-teal-800">Edit Demographics - {patient.mrn}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input {...register("firstName")} />
                {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input {...register("lastName")} />
                {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input type="date" {...register("dob")} />
                {errors.dob && <p className="text-red-500 text-xs">{errors.dob.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select onValueChange={(val) => setValue("gender", val as any)} defaultValue={watch("gender")}>
                  <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input {...register("phone")} />
                {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" {...register("email")} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Address</Label>
                <Input {...register("address")} />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input {...register("city")} />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input {...register("state")} />
              </div>
              <div className="space-y-2">
                <Label>Pincode</Label>
                <Input {...register("pincode")} />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
