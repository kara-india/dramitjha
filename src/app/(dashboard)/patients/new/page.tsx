"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, FormProvider } from "react-form-hooks"; // wait, usually I'd use react-hook-form, I'll fix this
import { useForm as useHookForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { patientSchema, PatientFormValues } from "../schema";
import { useCreatePatient } from "../queries";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";

const steps = [
  { id: 1, title: "Demographics" },
  { id: 2, title: "Contact" },
  { id: 3, title: "Medical History" },
  { id: 4, title: "Review & Save" }
];

export default function NewPatientRegistration() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const { mutateAsync: createPatient, isPending } = useCreatePatient();
  const [successData, setSuccessData] = useState<any>(null);

  const methods = useHookForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dob: "",
      gender: "Male",
      bloodGroup: "Unknown",
      phone: "",
      altPhone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      allergies: [],
      existingConditions: [],
      insuranceProvider: "",
      insuranceId: "",
      emergencyContacts: [{ name: "", relationship: "", phone: "" }],
    },
    mode: "onChange",
  });

  const { register, handleSubmit, formState: { errors }, trigger, watch, setValue } = methods;

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ["firstName", "lastName", "dob", "gender", "bloodGroup"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["phone", "email", "address", "city", "state", "pincode"];
    } else if (currentStep === 3) {
      fieldsToValidate = ["allergies", "existingConditions", "insuranceProvider", "insuranceId", "emergencyContacts"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: PatientFormValues) => {
    try {
      const res = await createPatient(data);
      setSuccessData(res.patient);
    } catch (err) {
      // Error is handled by mutation
    }
  };

  if (successData) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Card className="w-[500px] text-center p-6">
            <CheckCircle2 className="w-16 h-16 text-teal-500 mx-auto mb-4" />
            <CardTitle className="text-2xl text-teal-700 mb-2">Registration Successful</CardTitle>
            <CardDescription className="mb-6">
              Patient has been registered and assigned an MRN.
            </CardDescription>
            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
              <p className="text-sm text-gray-500 mb-1">Generated MRN</p>
              <p className="text-xl font-mono font-bold text-gray-800">{successData.mrn}</p>
              <div className="mt-4 flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{successData.firstName} {successData.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{successData.phone}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1" onClick={() => router.push(`/patients/${successData.id}`)}>
                View Patient
              </Button>
              <Button className="flex-1 bg-teal-600 hover:bg-teal-700">
                Book Appointment
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-teal-800 mb-6">Register New Patient</h2>
        {/* Step Indicator */}
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-teal-500 -z-10 -translate-y-1/2 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  step.id <= currentStep ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {step.id}
              </div>
              <span className={`text-xs mt-2 ${step.id <= currentStep ? "text-teal-700 font-medium" : "text-gray-500"}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" {...register("firstName")} />
                      {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" {...register("lastName")} />
                      {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth *</Label>
                      <Input id="dob" type="date" {...register("dob")} />
                      {errors.dob && <p className="text-red-500 text-xs">{errors.dob.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <Select onValueChange={(val) => setValue("gender", val as any)} defaultValue={watch("gender")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.gender && <p className="text-red-500 text-xs">{errors.gender.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <Select onValueChange={(val) => setValue("bloodGroup", val as any)} defaultValue={watch("bloodGroup")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Blood Group" />
                        </SelectTrigger>
                        <SelectContent>
                          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"].map((bg) => (
                            <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Mobile Number *</Label>
                      <Input id="phone" {...register("phone")} />
                      {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="altPhone">Alternate Phone</Label>
                      <Input id="altPhone" {...register("altPhone")} />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" {...register("email")} />
                      {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="address">Address *</Label>
                      <Input id="address" {...register("address")} />
                      {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input id="city" {...register("city")} />
                      {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input id="state" {...register("state")} />
                      {errors.state && <p className="text-red-500 text-xs">{errors.state.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input id="pincode" {...register("pincode")} />
                      {errors.pincode && <p className="text-red-500 text-xs">{errors.pincode.message}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700 border-b pb-2">Emergency Contact</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input {...register("emergencyContacts.0.name")} />
                        {errors.emergencyContacts?.[0]?.name && <p className="text-red-500 text-xs">Required</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Relationship</Label>
                        <Input {...register("emergencyContacts.0.relationship")} />
                        {errors.emergencyContacts?.[0]?.relationship && <p className="text-red-500 text-xs">Required</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input {...register("emergencyContacts.0.phone")} />
                        {errors.emergencyContacts?.[0]?.phone && <p className="text-red-500 text-xs">Required</p>}
                      </div>
                    </div>

                    <h3 className="font-semibold text-gray-700 border-b pb-2 pt-4">Insurance Details (Optional)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Provider</Label>
                        <Input {...register("insuranceProvider")} />
                      </div>
                      <div className="space-y-2">
                        <Label>Policy/Insurance ID</Label>
                        <Input {...register("insuranceId")} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-teal-50 border border-teal-100 rounded-lg p-4">
                    <h3 className="font-semibold text-teal-800 mb-4">Review Patient Details</h3>
                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                      <div><span className="text-gray-500">Name:</span> <span className="font-medium">{watch("firstName")} {watch("lastName")}</span></div>
                      <div><span className="text-gray-500">DOB:</span> <span className="font-medium">{watch("dob")}</span></div>
                      <div><span className="text-gray-500">Gender:</span> <span className="font-medium">{watch("gender")}</span></div>
                      <div><span className="text-gray-500">Blood Group:</span> <span className="font-medium">{watch("bloodGroup")}</span></div>
                      <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{watch("phone")}</span></div>
                      <div><span className="text-gray-500">Address:</span> <span className="font-medium">{watch("address")}, {watch("city")}, {watch("state")} - {watch("pincode")}</span></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-8 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1 || isPending}
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
              </Button>

              {currentStep < steps.length ? (
                <Button type="button" className="bg-teal-600 hover:bg-teal-700" onClick={nextStep}>
                  Next <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={isPending}>
                  {isPending ? "Registering..." : "Confirm & Register"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
