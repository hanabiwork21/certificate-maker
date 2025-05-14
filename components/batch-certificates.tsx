"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileSpreadsheet, FileImage, FileIcon as FilePdf, AlertCircle, RotateCcw } from "lucide-react"
import { toPng } from "html-to-image"
import { jsPDF } from "jspdf"
import JSZip from "jszip"
import CertificatePreview from "./certificate-preview"

interface BatchCertificatesProps {
  templateId: string
  customTemplate: string | null
  signatureImage: string | null
  sealImage: string | null
  fontStyles: {
    [key: string]: {
      size: number
      family: string
      color: string
      weight: string
    }
  }
  positions: {
    [key: string]: {
      x: number
      y: number
    }
  }
}

interface CertificateData {
  recipientName: string
  courseName: string
  completionDate: string
  issuerName: string
  certificateId: string
  additionalText: string
}

// Default positions for all elements
const defaultPositions = {
  recipientName: { x: 50, y: 40 },
  courseName: { x: 50, y: 50 },
  completionDate: { x: 50, y: 60 },
  issuerName: { x: 50, y: 70 },
  certificateId: { x: 50, y: 80 },
  additionalText: { x: 50, y: 65 },
  signature: { x: 70, y: 75 },
  seal: { x: 30, y: 75 },
}

export default function BatchCertificates({
  templateId,
  customTemplate,
  signatureImage,
  sealImage,
  fontStyles,
  positions,
}: BatchCertificatesProps) {
  const [csvData, setCsvData] = useState("")
  const [certificates, setCertificates] = useState<CertificateData[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0)
  const [currentPositions, setCurrentPositions] = useState(positions)

  const certificateRef = useRef<HTMLDivElement>(null)

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setCsvData(content)
      }
      reader.readAsText(file)
    }
  }

  const parseCSV = () => {
    setError(null)

    try {
      // Simple CSV parsing
      const lines = csvData.split("\n")
      if (lines.length < 2) {
        throw new Error("CSV must contain a header row and at least one data row")
      }

      const headers = lines[0].split(",").map((h) => h.trim())
      const requiredFields = [
        "recipientName",
        "courseName",
        "completionDate",
        "issuerName",
        "certificateId",
        "additionalText",
      ]

      // Check if all required fields are present
      const missingFields = requiredFields.filter((field) => !headers.includes(field))
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`)
      }

      const parsedCertificates: CertificateData[] = []

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue // Skip empty lines

        const values = lines[i].split(",").map((v) => v.trim())
        if (values.length !== headers.length) {
          throw new Error(`Line ${i + 1} has ${values.length} values, but should have ${headers.length}`)
        }

        const certificate: any = {}
        headers.forEach((header, index) => {
          certificate[header] = values[index]
        })

        parsedCertificates.push(certificate as CertificateData)
      }

      setCertificates(parsedCertificates)
      setCurrentPreviewIndex(0)
    } catch (err: any) {
      setError(err.message)
      setCertificates([])
    }
  }

  const resetPositions = () => {
    setCurrentPositions({ ...defaultPositions })
  }

  const downloadAllAsPNG = async () => {
    if (certificates.length === 0) return

    setIsProcessing(true)
    try {
      const zip = new JSZip()

      for (let i = 0; i < certificates.length; i++) {
        setCurrentPreviewIndex(i)

        // Wait a bit for the DOM to update
        await new Promise((resolve) => setTimeout(resolve, 100))

        if (certificateRef.current) {
          const dataUrl = await toPng(certificateRef.current, { quality: 1.0 })
          const base64Data = dataUrl.split(",")[1]
          zip.file(`${certificates[i].recipientName}-certificate.png`, base64Data, { base64: true })
        }
      }

      const content = await zip.generateAsync({ type: "blob" })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(content)
      link.download = "certificates.zip"
      link.click()
    } catch (error) {
      console.error("Error generating PNGs:", error)
      setError("Failed to generate PNG files")
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadAllAsPDF = async () => {
    if (certificates.length === 0) return

    setIsProcessing(true)
    try {
      const zip = new JSZip()

      for (let i = 0; i < certificates.length; i++) {
        setCurrentPreviewIndex(i)

        // Wait a bit for the DOM to update
        await new Promise((resolve) => setTimeout(resolve, 100))

        if (certificateRef.current) {
          const dataUrl = await toPng(certificateRef.current, { quality: 1.0 })

          const pdf = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4",
          })

          const imgProps = pdf.getImageProperties(dataUrl)
          const pdfWidth = pdf.internal.pageSize.getWidth()
          const pdfHeight = pdf.internal.pageSize.getHeight()
          const imgWidth = imgProps.width
          const imgHeight = imgProps.height

          const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
          const imgX = (pdfWidth - imgWidth * ratio) / 2
          const imgY = (pdfHeight - imgHeight * ratio) / 2

          pdf.addImage(dataUrl, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio)

          const pdfBlob = pdf.output("blob")
          zip.file(`${certificates[i].recipientName}-certificate.pdf`, pdfBlob)
        }
      }

      const content = await zip.generateAsync({ type: "blob" })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(content)
      link.download = "certificates-pdf.zip"
      link.click()
    } catch (error) {
      console.error("Error generating PDFs:", error)
      setError("Failed to generate PDF files")
    } finally {
      setIsProcessing(false)
    }
  }

  const getCSVTemplate = () => {
    return "recipientName,courseName,completionDate,issuerName,certificateId,additionalText\nJohn Doe,Web Development,2023-05-15,Tech Academy,CERT-1001,Successfully completed the course with distinction\nJane Smith,Data Science,2023-05-20,Tech Academy,CERT-1002,Completed with excellence"
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Batch Certificate Generation</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csvUpload">Upload CSV File</Label>
              <div className="flex gap-2">
                <Input id="csvUpload" type="file" accept=".csv" onChange={handleCsvUpload} />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const template = getCSVTemplate()
                    setCsvData(template)
                  }}
                  title="Get CSV Template"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                CSV must include: recipientName, courseName, completionDate, issuerName, certificateId, additionalText
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="csvData">CSV Data</Label>
              <Textarea
                id="csvData"
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                placeholder="Paste CSV data here"
                rows={10}
              />
            </div>

            <Button onClick={parseCSV}>Process CSV Data</Button>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Certificate Preview</h2>

          {certificates.length > 0 ? (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPreviewIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentPreviewIndex === 0}
                    >
                      Previous
                    </Button>
                    <span>
                      {currentPreviewIndex + 1} of {certificates.length}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPreviewIndex((prev) => Math.min(certificates.length - 1, prev + 1))}
                      disabled={currentPreviewIndex === certificates.length - 1}
                    >
                      Next
                    </Button>
                  </div>

                  <CertificatePreview
                    ref={certificateRef}
                    certificateData={certificates[currentPreviewIndex]}
                    selectedTemplate={templateId}
                    customTemplate={customTemplate}
                    signatureImage={signatureImage}
                    sealImage={sealImage}
                    fontStyles={fontStyles}
                    positions={currentPositions}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-center gap-4 flex-wrap">
                <Button onClick={downloadAllAsPNG} disabled={isProcessing} className="flex items-center gap-2">
                  <FileImage size={18} />
                  Download All as PNG
                </Button>
                <Button onClick={downloadAllAsPDF} disabled={isProcessing} className="flex items-center gap-2">
                  <FilePdf size={18} />
                  Download All as PDF
                </Button>
                <Button onClick={resetPositions} className="flex items-center gap-2">
                  <RotateCcw size={18} />
                  Reset Positions
                </Button>
              </div>

              {isProcessing && (
                <div className="text-center">
                  <p>Processing certificates... This may take a moment.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="border rounded-lg p-8 text-center bg-gray-50">
              <p className="text-gray-500">Process CSV data to preview certificates</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
