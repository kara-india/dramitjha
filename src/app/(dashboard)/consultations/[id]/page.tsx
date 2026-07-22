"use client";

import { use, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Activity, FileText, Pill, Upload, CheckCircle, Save, Stethoscope, Scissors, UserCheck } from "lucide-react";
import { getConsultation, saveConsultation, signOffConsultation, addOrthopedicData, uploadMedicalFile } from "../actions";

// Using native HTML elements heavily styled with Tailwind to simulate shadcn/ui without importing missing components
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ConsultationEMRPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Vitals State
  const [vitals, setVitals] = useState({
    bpSystolic: "", bpDiastolic: "", heartRate: "", spO2: "", temperature: "", weight: "", height: "", painScore: "0", bloodSugar: ""
  });
  
  // SOAP State
  const [soap, setSoap] = useState({
    subjective: "", objective: "", assessmentPrimary: "", assessmentSecondary: "", plan: ""
  });

  // Department State
  const [ortho, setOrtho] = useState({
    affectedJoint: "", affectedSide: "NA", mechanismOfInjury: "", lachman: "NOT_DONE", anteriorDrawer: "NOT_DONE"
  });

  const [prescriptions, setPrescriptions] = useState<any[]>([]);

  useEffect(() => {
    async function fetchConsultation() {
      const res = await getConsultation(id);
      if (res) {
        setData(res);
        setVitals({
          bpSystolic: res.vitals?.bpSystolic?.toString() || "",
          bpDiastolic: res.vitals?.bpDiastolic?.toString() || "",
          heartRate: res.vitals?.heartRate?.toString() || "",
          spO2: res.vitals?.spO2?.toString() || "",
          temperature: res.vitals?.temperature?.toString() || "",
          weight: res.vitals?.weight?.toString() || "",
          height: res.vitals?.height?.toString() || "",
          painScore: res.vitals?.painScore?.toString() || "0",
          bloodSugar: res.vitals?.bloodSugar?.toString() || "",
        });
        setSoap({
          subjective: res.soapNotes?.subjective || res.appointment?.chiefComplaint || "",
          objective: res.soapNotes?.objective || "",
          assessmentPrimary: res.soapNotes?.assessmentPrimary || "",
          assessmentSecondary: res.soapNotes?.assessmentSecondary || "",
          plan: res.soapNotes?.plan || "",
        });
      }
      setLoading(false);
    }
    fetchConsultation();
  }, [id]);

  // Auto-save every 30s
  useEffect(() => {
    if (loading) return;
    const interval = setInterval(async () => {
      handleSave();
    }, 30000);
    return () => clearInterval(interval);
  }, [vitals, soap, loading]);

  const handleSave = async () => {
    setSaving(true);
    await saveConsultation(id, {
      bpSystolic: Number(vitals.bpSystolic) || undefined,
      bpDiastolic: Number(vitals.bpDiastolic) || undefined,
      weight: Number(vitals.weight) || undefined,
      height: Number(vitals.height) || undefined,
      painScore: Number(vitals.painScore) || undefined,
    }, soap);
    if (data?.appointment?.department === "ORTHOPEDIC") {
      await addOrthopedicData(id, {
        ...ortho,
        affectedSide: (ortho.affectedSide as "LEFT" | "RIGHT" | "BILATERAL" | "NA") || "NA",
      });
    }
    setSaving(false);
  };

  const bmi = vitals.weight && vitals.height ? (Number(vitals.weight) / ((Number(vitals.height)/100) ** 2)).toFixed(1) : "--";

  const handleSignOff = async () => {
    const res = await signOffConsultation(id);
    if (res.success) {
      alert("Consultation Signed Off Successfully");
    } else {
      alert(res.error);
    }
  };

  if (loading) return <div className="p-8 text-center animate-pulse">Loading Consultation Workspace...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Consultation not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-inter pb-24">
      {/* Header Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-outfit font-bold text-xl">
            {data.patient.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-outfit font-bold text-slate-900 flex items-center gap-2">
              {data.patient.name}
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-inter font-medium">{data.patient.mrn}</span>
            </h1>
            <div className="text-sm text-slate-500 flex gap-3 mt-1">
              <span>{data.patient.age}y {data.patient.gender}</span>
              <span>•</span>
              <span className="text-red-600 font-medium">Blood: {data.patient.bloodGroup}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">
            {saving ? "Saving..." : "All changes saved"}
          </span>
          <button onClick={handleSave} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button onClick={handleSignOff} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center gap-2 shadow-sm">
            <CheckCircle className="w-4 h-4" /> Sign Off & Complete
          </button>
        </div>
      </div>

      {/* Allergies Alert */}
      {data.patient.allergies?.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-red-800">Active Allergies</h3>
            <p className="text-sm text-red-700 mt-1">{data.patient.allergies.join(", ")}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* SOAP Notes */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="font-outfit font-semibold text-lg text-slate-800">SOAP Notes</h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subjective (Chief Complaint & History)</label>
                <textarea 
                  className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none min-h-[100px]"
                  value={soap.subjective}
                  onChange={(e) => setSoap({...soap, subjective: e.target.value})}
                  placeholder="Patient reports..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Objective (Examination Findings)</label>
                <textarea 
                  className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none min-h-[100px]"
                  value={soap.objective}
                  onChange={(e) => setSoap({...soap, objective: e.target.value})}
                  placeholder="On examination..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Primary Diagnosis</label>
                  <input 
                    type="text"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                    value={soap.assessmentPrimary}
                    onChange={(e) => setSoap({...soap, assessmentPrimary: e.target.value})}
                    placeholder="e.g. ACL Tear (M23.2)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Secondary Diagnosis</label>
                  <input 
                    type="text"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                    value={soap.assessmentSecondary}
                    onChange={(e) => setSoap({...soap, assessmentSecondary: e.target.value})}
                    placeholder="e.g. Hypertension"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Plan (Treatment & Advice)</label>
                <textarea 
                  className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none min-h-[100px]"
                  value={soap.plan}
                  onChange={(e) => setSoap({...soap, plan: e.target.value})}
                  placeholder="Advised physiotherapy..."
                />
              </div>
            </div>
          </div>

          {/* Department Specific: Orthopedic */}
          {data.appointment.department === "ORTHOPEDIC" && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                <Scissors className="w-5 h-5 text-teal-600" />
                <h2 className="font-outfit font-semibold text-lg text-slate-800">Orthopedic Assessment</h2>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Affected Joint</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" value={ortho.affectedJoint} onChange={e=>setOrtho({...ortho, affectedJoint: e.target.value})} placeholder="e.g. Knee, Shoulder" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Affected Side</label>
                  <select className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" value={ortho.affectedSide} onChange={e=>setOrtho({...ortho, affectedSide: e.target.value})}>
                    <option value="NA">Not Applicable</option>
                    <option value="LEFT">Left</option>
                    <option value="RIGHT">Right</option>
                    <option value="BILATERAL">Bilateral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Lachman's Test</label>
                  <select className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" value={ortho.lachman} onChange={e=>setOrtho({...ortho, lachman: e.target.value})}>
                    <option value="NOT_DONE">Not Done</option>
                    <option value="POSITIVE">Positive</option>
                    <option value="NEGATIVE">Negative</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Anterior Drawer Test</label>
                  <select className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" value={ortho.anteriorDrawer} onChange={e=>setOrtho({...ortho, anteriorDrawer: e.target.value})}>
                    <option value="NOT_DONE">Not Done</option>
                    <option value="POSITIVE">Positive</option>
                    <option value="NEGATIVE">Negative</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Prescription Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
              <Pill className="w-5 h-5 text-purple-600" />
              <h2 className="font-outfit font-semibold text-lg text-slate-800">Prescriptions</h2>
            </div>
            <div className="p-4">
              <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-lg mb-4 text-slate-500">
                <p>Prescription feature coming soon (inventory search integration).</p>
                <button className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm">+ Add Medicine</button>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Vitals Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-500" />
              <h2 className="font-outfit font-semibold text-lg text-slate-800">Vitals</h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">BP (mmHg)</label>
                <div className="flex items-center gap-1">
                  <input type="number" placeholder="Sys" className="w-full border rounded p-1.5 text-sm text-center" value={vitals.bpSystolic} onChange={e=>setVitals({...vitals, bpSystolic: e.target.value})} />
                  <span className="text-slate-400">/</span>
                  <input type="number" placeholder="Dia" className="w-full border rounded p-1.5 text-sm text-center" value={vitals.bpDiastolic} onChange={e=>setVitals({...vitals, bpDiastolic: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Heart Rate (bpm)</label>
                <input type="number" className="w-full border rounded p-1.5 text-sm" value={vitals.heartRate} onChange={e=>setVitals({...vitals, heartRate: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Weight (kg)</label>
                <input type="number" className="w-full border rounded p-1.5 text-sm" value={vitals.weight} onChange={e=>setVitals({...vitals, weight: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Height (cm)</label>
                <input type="number" className="w-full border rounded p-1.5 text-sm" value={vitals.height} onChange={e=>setVitals({...vitals, height: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">Pain Score (VAS 0-10)</label>
                <input type="range" min="0" max="10" className="w-full accent-teal-600" value={vitals.painScore} onChange={e=>setVitals({...vitals, painScore: e.target.value})} />
                <div className="text-center text-xs font-bold text-teal-700">{vitals.painScore} / 10</div>
              </div>
              <div className="col-span-2 bg-slate-50 p-2 rounded flex justify-between items-center">
                <span className="text-xs text-slate-600 font-medium">Calculated BMI</span>
                <span className="font-bold text-sm text-slate-800">{bmi}</span>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
              <Upload className="w-5 h-5 text-slate-600" />
              <h2 className="font-outfit font-semibold text-lg text-slate-800">Reports / Scans</h2>
            </div>
            <div className="p-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600">Click to upload X-ray, MRI, or PDF reports.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
