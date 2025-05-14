"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CertificateFormProps {
  certificateData: {
    recipientName: string
    courseName: string
    completionDate: string
    issuerName: string
    certificateId: string
    additionalText: string
  }
  onInputChange: (field: string, value: string) => void
  onSignatureUpload: (file: File | null) => void
  onSealUpload: (file: File | null) => void
  signatureImage: string | null
  sealImage: string | null
}

export default function CertificateForm({
  certificateData,
  onInputChange,
  onSignatureUpload,
  onSealUpload,
  signatureImage,
  sealImage,
}: CertificateFormProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, uploadHandler: (file: File | null) => void) => {
    const file = event.target.files?.[0]
    if (file) {
      uploadHandler(file)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="recipientName">Recipient Name</Label>
        <Input
          id="recipientName"
          value={certificateData.recipientName}
          onChange={(e) => onInputChange("recipientName", e.target.value)}
          placeholder="Enter recipient name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="courseName">Course/Achievement Name</Label>
        <Input
          id="courseName"
          value={certificateData.courseName}
          onChange={(e) => onInputChange("courseName", e.target.value)}
          placeholder="Enter course or achievement name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="completionDate">Completion Date</Label>
        <Input
          id="completionDate"
          type="date"
          value={certificateData.completionDate}
          onChange={(e) => onInputChange("completionDate", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="issuerName">Issuer Name</Label>
        <Input
          id="issuerName"
          value={certificateData.issuerName}
          onChange={(e) => onInputChange("issuerName", e.target.value)}
          placeholder="Enter issuer name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="certificateId">Certificate ID</Label>
        <Input
          id="certificateId"
          value={certificateData.certificateId}
          onChange={(e) => onInputChange("certificateId", e.target.value)}
          placeholder="Enter certificate ID"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalText">Additional Text</Label>
        <Textarea
          id="additionalText"
          value={certificateData.additionalText}
          onChange={(e) => onInputChange("additionalText", e.target.value)}
          placeholder="Enter additional text or description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="space-y-2">
          <Label htmlFor="signatureUpload">Signature Upload</Label>
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            {signatureImage ? (
              <div className="flex flex-col items-center">
                <img src={signatureImage || "/placeholder.svg"} alt="Signature" className="h-16 object-contain mb-2" />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onSignatureUpload(null)}>
                    Remove
                  </Button>
                  <label htmlFor="signatureUpload" className="cursor-pointer">
                    <Button variant="outline" size="sm" asChild>
                      <span>Change</span>
                    </Button>
                  </label>
                </div>
              </div>
            ) : (
              <label htmlFor="signatureUpload" className="cursor-pointer flex flex-col items-center">
                <Upload className="h-6 w-6 mb-2" />
                <span className="text-sm">Upload Signature</span>
              </label>
            )}
            <input
              id="signatureUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, onSignatureUpload)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sealUpload">Seal/Logo Upload</Label>
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            {sealImage ? (
              <div className="flex flex-col items-center">
                <img src={sealImage || "/placeholder.svg"} alt="Seal" className="h-16 object-contain mb-2" />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onSealUpload(null)}>
                    Remove
                  </Button>
                  <label htmlFor="sealUpload" className="cursor-pointer">
                    <Button variant="outline" size="sm" asChild>
                      <span>Change</span>
                    </Button>
                  </label>
                </div>
              </div>
            ) : (
              <label htmlFor="sealUpload" className="cursor-pointer flex flex-col items-center">
                <Upload className="h-6 w-6 mb-2" />
                <span className="text-sm">Upload Seal/Logo</span>
              </label>
            )}
            <input
              id="sealUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, onSealUpload)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
