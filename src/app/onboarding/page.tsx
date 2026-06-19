"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import {
  KycCategory,
  getKycCategories,
  submitKyc,
  addKycRepresentatives,
  KycRepresentative,
  uploadDocument,
} from "@/src/services/kyc/kyc";

export default function OnboardingPage() {
  const router = useRouter();
  
  // High-level steps: 1 = KYC Form, 2 = Representatives (Business Only)
  const [step, setStep] = useState<1 | 2>(1);
  const [subStep, setSubStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [kycId, setKycId] = useState<string | null>(null);

  // -- Common Form States --
  const [type, setType] = useState<"individual" | "business">("business");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  
  // -- Individual Specific Fields --
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [nationality, setNationality] = useState("");
  const [residentialAddress, setResidentialAddress] = useState("");
  const [mailingAddress, setMailingAddress] = useState("");
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [proofOfAddress, setProofOfAddress] = useState<File | null>(null);

  // -- Business Specific Fields --
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [taxIdentificationNumber, setTaxIdentificationNumber] = useState("");
  const [industryCategoryId, setIndustryCategoryId] = useState<number | "other">("");
  const [otherIndustryCategory, setOtherIndustryCategory] = useState("");
  const [industry, setIndustry] = useState(""); 
  const [registeredAddress, setRegisteredAddress] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [contactPersonName, setContactPersonName] = useState("");
  const [contactPersonEmail, setContactPersonEmail] = useState("");
  const [certificateOfIncorporation, setCertificateOfIncorporation] = useState<File | null>(null);
  const [memorandumArticles, setMemorandumArticles] = useState<File | null>(null);
  
  const [categories, setCategories] = useState<KycCategory[]>([]);

  // Representatives fields (Business Only)
  const [representatives, setRepresentatives] = useState<KycRepresentative[]>([
    { name: "", position: "" }
  ]);

  // Load categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getKycCategories();
        const catArray = Array.isArray(data) ? data : (data as any).data || [];
        setCategories(catArray);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };
    fetchCategories();
    
    // Auto-fill email if stored locally
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) setEmail(storedEmail);
  }, []);

  // Handle Type Change - Reset Substep
  const handleTypeChange = (newType: "individual" | "business") => {
    setType(newType);
    setSubStep(1);
  };

  const handleNextSubStep = () => setSubStep((prev) => prev + 1);
  const handlePrevSubStep = () => setSubStep((prev) => Math.max(1, prev - 1));

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Manage Wizard Progression
    if (type === "individual" && subStep < 3) return handleNextSubStep();
    if (type === "business" && subStep < 4) return handleNextSubStep();

    setIsLoading(true);

    try {
      // 1. Upload files first
      let uploadedIdDoc = { url: "", publicId: "" };
      let uploadedProofAddr = { url: "", publicId: "" };
      let uploadedCertInc = { url: "", publicId: "" };
      let uploadedMemArt = { url: "", publicId: "" };

      if (type === "individual") {
        if (idDocument) {
          const res = await uploadDocument(idDocument);
          uploadedIdDoc = { url: res.url, publicId: res.publicId };
        }
        if (proofOfAddress) {
          const res = await uploadDocument(proofOfAddress);
          uploadedProofAddr = { url: res.url, publicId: res.publicId };
        }
      } else {
        if (certificateOfIncorporation) {
          const res = await uploadDocument(certificateOfIncorporation);
          uploadedCertInc = { url: res.url, publicId: res.publicId };
        }
        if (memorandumArticles) {
          const res = await uploadDocument(memorandumArticles);
          uploadedMemArt = { url: res.url, publicId: res.publicId };
        }
      }

      // 2. Construct Payload
      const payload: any = {
        type,
        email,
        phoneNumber,
        idType,
        idNumber,
      };

      if (type === "individual") {
        payload.firstName = firstName;
        payload.lastName = lastName;
        payload.dateOfBirth = dateOfBirth;
        payload.nationality = nationality;
        payload.residentialAddress = residentialAddress;
        payload.mailingAddress = mailingAddress;
        payload.idDocument = uploadedIdDoc.url;
        payload.idDocumentPublicId = uploadedIdDoc.publicId;
        payload.proofOfAddress = uploadedProofAddr.url;
        payload.proofOfAddressPublicId = uploadedProofAddr.publicId;
      } else {
        payload.businessName = businessName;
        payload.businessType = businessType;
        payload.registrationNumber = registrationNumber;
        payload.taxIdentificationNumber = taxIdentificationNumber;
        payload.industry = industry;
        payload.registeredAddress = registeredAddress;
        payload.businessAddress = businessAddress;
        payload.contactPersonName = contactPersonName;
        payload.contactPersonEmail = contactPersonEmail;
        payload.certificateOfIncorporation = uploadedCertInc.url;
        payload.certificateOfIncorporationPublicId = uploadedCertInc.publicId;
        payload.memorandumArticles = uploadedMemArt.url;
        payload.memorandumArticlesPublicId = uploadedMemArt.publicId;

        if (industryCategoryId !== "other") {
          payload.industryCategoryId = Number(industryCategoryId);
        } else {
          payload.otherIndustryCategory = otherIndustryCategory;
        }
      }

      const response = await submitKyc(payload);
      toast.success(response.message || "KYC details submitted successfully.");
      
      if (type === "business") {
        if (response.kycId || response.data?.id) {
           setKycId(response.kycId || response.data?.id);
        }
        setStep(2);
      } else {
        // Refresh session or redirect
        window.location.href = "/dashboard";
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit KYC details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validReps = representatives.filter(rep => rep.name.trim() !== "" && rep.position.trim() !== "");
      
      if (validReps.length === 0) {
        toast.error("Please add at least one representative.");
        setIsLoading(false);
        return;
      }

      await addKycRepresentatives({
        kycId: kycId as string,
        representatives: validReps,
      });

      toast.success("Representatives added successfully!");
      window.location.href = "/dashboard";
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add representatives.");
    } finally {
      setIsLoading(false);
    }
  };

  const addRepresentativeRow = () => setRepresentatives([...representatives, { name: "", position: "" }]);
  const removeRepresentativeRow = (index: number) => {
    if (representatives.length > 1) {
      const newReps = [...representatives];
      newReps.splice(index, 1);
      setRepresentatives(newReps);
    }
  };
  const updateRepresentative = (index: number, field: keyof KycRepresentative, value: string) => {
    const newReps = [...representatives];
    newReps[index][field] = value;
    setRepresentatives(newReps);
  };

  // UI Helpers
  const Input = ({ label, type = "text", value, onChange, placeholder, required = true }: any) => (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-[#101D2D]">{label}</label>
      <input type={type} required={required} value={value} onChange={onChange} placeholder={placeholder} className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-sm text-zinc-800 placeholder-zinc-400 outline-none transition-all focus:border-[#FF6B2B]/60 focus:bg-white focus:ring-1 focus:ring-[#FF6B2B]/60" />
    </div>
  );

  const FileInput = ({ label, onChange, required = true }: any) => (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-[#101D2D]">{label}</label>
      <input type="file" required={required} onChange={onChange} className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-2.5 text-sm text-zinc-800 outline-none transition-all focus:border-[#FF6B2B]/60 focus:bg-white focus:ring-1 focus:ring-[#FF6B2B]/60 file:mr-4 file:rounded-md file:border-0 file:bg-[#101D2D] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-opacity-90" />
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-zinc-50/50 px-4 py-12 sm:px-6 lg:px-8 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:24px_24px]">
        {/* Top Left Navigation Back Dashboard */}
        <div className="absolute top-6 left-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-[#101D2D] transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <div className="w-full max-w-2xl">
          {/* Card Container */}
          <div className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-xl shadow-zinc-100/50 sm:p-10">
            {/* Logo Section */}
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-2 group mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#101D2D] text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="5" r="3" fill="#FF6B2B" stroke="#FF6B2B" />
                    <circle cx="6" cy="17" r="3" fill="currentColor" />
                    <circle cx="18" cy="17" r="3" fill="currentColor" />
                    <path d="M6 14l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-2xl font-black tracking-tight text-[#101D2D]">
                  Naija<span className="text-[#FF6B2B]">Pass</span>
                </span>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B2B]">
                Onboarding Portal
              </span>
              <h2 className="mt-4 text-xl md:text-2xl font-bold text-[#101D2D]">
                {step === 1 ? "Complete Your KYC Profile" : "Add Business Representatives"}
              </h2>
              <p className="mt-2 text-sm md:text-base text-zinc-500">
                {step === 1 
                  ? "Follow the steps below to verify your identity and unlock full platform access." 
                  : "List the executive members or directors associated with your business."}
              </p>
            </div>

            {/* Step Progress Indicator (Only for Step 1) */}
            {step === 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                {Array.from({ length: type === "business" ? 4 : 3 }).map((_, i) => (
                  <div key={i} className={`h-2 w-8 rounded-full transition-all ${i + 1 <= subStep ? "bg-[#FF6B2B]" : "bg-zinc-200"}`} />
                ))}
              </div>
            )}

            {/* Step 1 Form (Multi-step) */}
            {step === 1 && (
              <form onSubmit={handleStep1Submit} className="mt-8 space-y-6">
                
                {/* --- SUBSTEP 1: Basic Information --- */}
                {subStep === 1 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-4 border-b border-zinc-100 pb-6">
                      <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-200 p-4 transition-all hover:bg-zinc-50 has-[:checked]:border-[#FF6B2B] has-[:checked]:bg-[#FF6B2B]/5">
                        <input
                          type="radio"
                          name="type"
                          value="business"
                          checked={type === "business"}
                          onChange={() => handleTypeChange("business")}
                          className="h-4 w-4 text-[#FF6B2B] focus:ring-[#FF6B2B]"
                        />
                        <span className={`text-sm font-bold ${type === "business" ? "text-[#101D2D]" : "text-zinc-500"}`}>
                          Business Entity
                        </span>
                      </label>
                      <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-200 p-4 transition-all hover:bg-zinc-50 has-[:checked]:border-[#FF6B2B] has-[:checked]:bg-[#FF6B2B]/5">
                        <input
                          type="radio"
                          name="type"
                          value="individual"
                          checked={type === "individual"}
                          onChange={() => handleTypeChange("individual")}
                          className="h-4 w-4 text-[#FF6B2B] focus:ring-[#FF6B2B]"
                        />
                        <span className={`text-sm font-bold ${type === "individual" ? "text-[#101D2D]" : "text-zinc-500"}`}>
                          Individual
                        </span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <Input label="Email Address" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="you@example.com" />
                      <Input label="Phone Number" type="tel" value={phoneNumber} onChange={(e: any) => setPhoneNumber(e.target.value)} placeholder="+234 800 000 0000" />
                      
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#101D2D]">ID Type</label>
                        <select required value={idType} onChange={(e) => setIdType(e.target.value)} className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-sm text-zinc-800 outline-none transition-all focus:border-[#FF6B2B]/60 focus:bg-white focus:ring-1 focus:ring-[#FF6B2B]/60">
                          <option value="" disabled>Select ID Type...</option>
                          {type === "business" ? (
                            <option value="cac">CAC Registration Document</option>
                          ) : (
                            <>
                              <option value="NIN">National Identity Number (NIN)</option>
                              <option value="Passport">International Passport</option>
                              <option value="DriversLicense">Driver's License</option>
                              <option value="VotersCard">Voter's Card</option>
                            </>
                          )}
                        </select>
                      </div>

                      <Input label="ID Number" type="text" value={idNumber} onChange={(e: any) => setIdNumber(e.target.value)} placeholder="Enter ID Number" />
                    </div>
                  </div>
                )}

                {/* --- SUBSTEP 2: Extended Details --- */}
                {subStep === 2 && type === "individual" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <Input label="First Name" value={firstName} onChange={(e: any) => setFirstName(e.target.value)} placeholder="John" />
                      <Input label="Last Name" value={lastName} onChange={(e: any) => setLastName(e.target.value)} placeholder="Doe" />
                      <Input label="Date of Birth" type="date" value={dateOfBirth} onChange={(e: any) => setDateOfBirth(e.target.value)} placeholder="" />
                      <Input label="Nationality" value={nationality} onChange={(e: any) => setNationality(e.target.value)} placeholder="Nigerian" />
                    </div>
                  </div>
                )}

                {subStep === 2 && type === "business" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <Input label="Business Name" value={businessName} onChange={(e: any) => setBusinessName(e.target.value)} placeholder="Company Ltd" />
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <Input label="Business Type" value={businessType} onChange={(e: any) => setBusinessType(e.target.value)} placeholder="e.g. LLC" />
                      <Input label="Registration No. (RC)" value={registrationNumber} onChange={(e: any) => setRegistrationNumber(e.target.value)} placeholder="RC-123456" />
                      <Input label="Tax ID Number (TIN)" value={taxIdentificationNumber} onChange={(e: any) => setTaxIdentificationNumber(e.target.value)} placeholder="TIN-0000000" />
                      <Input label="Industry" value={industry} onChange={(e: any) => setIndustry(e.target.value)} placeholder="e.g. Information Technology" />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#101D2D]">Industry Category</label>
                      <select required value={industryCategoryId} onChange={(e) => setIndustryCategoryId(e.target.value === "other" ? "other" : Number(e.target.value))} className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-sm text-zinc-800 outline-none transition-all focus:border-[#FF6B2B]/60 focus:bg-white focus:ring-1 focus:ring-[#FF6B2B]/60">
                        <option value="" disabled>Select an industry...</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                        <option value="other">Other (Please specify)</option>
                      </select>
                    </div>

                    {industryCategoryId === "other" && (
                      <Input label="Specify Custom Industry" value={otherIndustryCategory} onChange={(e: any) => setOtherIndustryCategory(e.target.value)} placeholder="E.g. Advanced Robotics" />
                    )}
                  </div>
                )}

                {/* --- SUBSTEP 3: Addresses & Uploads (Individual) OR Addresses (Business) --- */}
                {subStep === 3 && type === "individual" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <Input label="Residential Address" value={residentialAddress} onChange={(e: any) => setResidentialAddress(e.target.value)} placeholder="123 Main St..." />
                    <Input label="Mailing Address" value={mailingAddress} onChange={(e: any) => setMailingAddress(e.target.value)} placeholder="P.O. Box 456..." />
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <FileInput label="Upload ID Document" onChange={(e: any) => setIdDocument(e.target.files?.[0] || null)} />
                      <FileInput label="Upload Proof of Address" onChange={(e: any) => setProofOfAddress(e.target.files?.[0] || null)} />
                    </div>
                  </div>
                )}

                {subStep === 3 && type === "business" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <Input label="Registered Address" value={registeredAddress} onChange={(e: any) => setRegisteredAddress(e.target.value)} placeholder="123 Main St..." />
                    <Input label="Business Address" value={businessAddress} onChange={(e: any) => setBusinessAddress(e.target.value)} placeholder="456 Secondary St..." />
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <Input label="Contact Person Name" value={contactPersonName} onChange={(e: any) => setContactPersonName(e.target.value)} placeholder="Jane Doe" />
                      <Input label="Contact Person Email" type="email" value={contactPersonEmail} onChange={(e: any) => setContactPersonEmail(e.target.value)} placeholder="jane@company.com" />
                    </div>
                  </div>
                )}

                {/* --- SUBSTEP 4: Document Uploads (Business Only) --- */}
                {subStep === 4 && type === "business" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <FileInput label="Upload Certificate of Incorporation" onChange={(e: any) => setCertificateOfIncorporation(e.target.files?.[0] || null)} />
                    <FileInput label="Upload Memorandum & Articles" onChange={(e: any) => setMemorandumArticles(e.target.files?.[0] || null)} />
                  </div>
                )}

                {/* --- Form Navigation --- */}
                <div className="flex items-center gap-4 pt-4 border-t border-zinc-100">
                  {subStep > 1 && (
                    <button type="button" onClick={handlePrevSubStep} className="flex h-12 flex-1 items-center justify-center rounded-xl border border-zinc-200 bg-white text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 active:bg-zinc-100">
                      Back
                    </button>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex h-12 flex-[2] items-center justify-center rounded-xl bg-[#101D2D] text-sm font-semibold text-white shadow-lg shadow-[#101D2D]/10 transition-all hover:bg-opacity-90 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Processing...
                      </span>
                    ) : (
                      (type === "individual" && subStep === 3) || (type === "business" && subStep === 4)
                        ? "Submit KYC Application"
                        : "Continue to Next Step"
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Step 2 Form (Business Representatives) */}
            {step === 2 && (
              <form onSubmit={handleStep2Submit} className="mt-8 space-y-6">
                
                <div className="space-y-4">
                  {representatives.map((rep, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-4 items-start p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                      <div className="flex-1 space-y-2 w-full">
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">Full Name</label>
                        <input type="text" required value={rep.name} onChange={(e) => updateRepresentative(idx, "name", e.target.value)} placeholder="John Doe" className="block w-full rounded-lg border border-zinc-200 bg-white p-2.5 text-sm text-zinc-800 placeholder-zinc-400 outline-none transition-all focus:border-[#FF6B2B]/60 focus:ring-1 focus:ring-[#FF6B2B]/60" />
                      </div>
                      <div className="flex-1 space-y-2 w-full">
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">Position / Title</label>
                        <input type="text" required value={rep.position} onChange={(e) => updateRepresentative(idx, "position", e.target.value)} placeholder="Director" className="block w-full rounded-lg border border-zinc-200 bg-white p-2.5 text-sm text-zinc-800 placeholder-zinc-400 outline-none transition-all focus:border-[#FF6B2B]/60 focus:ring-1 focus:ring-[#FF6B2B]/60" />
                      </div>
                      
                      {representatives.length > 1 && (
                        <button type="button" onClick={() => removeRepresentativeRow(idx)} className="mt-6 sm:mt-7 p-2.5 text-zinc-400 hover:text-red-500 transition-colors">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button type="button" onClick={addRepresentativeRow} className="flex items-center gap-2 text-sm font-bold text-[#FF6B2B] hover:text-[#E55F23] transition-colors">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  Add Another Representative
                </button>

                <button type="submit" disabled={isLoading} className="flex w-full h-12 items-center justify-center rounded-xl bg-[#FF6B2B] text-sm font-semibold text-white shadow-lg shadow-[#FF6B2B]/10 transition-all hover:bg-[#E55F23] focus:outline-none disabled:opacity-70 mt-4">
                  {isLoading ? "Submitting..." : "Complete KYC & Add Representatives"}
                </button>
              </form>
            )}

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
