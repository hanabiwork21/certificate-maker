"use client"

import { useState, useRef, useEffect } from "react"
import { toPng } from "html-to-image"
import { jsPDF } from "jspdf"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CertificateForm from "@/components/certificate-form"
import CertificatePreview from "@/components/certificate-preview"
import CertificateEditor from "@/components/certificate-editor"
import TemplateSelector from "@/components/template-selector"
import BatchCertificates from "@/components/batch-certificates"
import { Button } from "@/components/ui/button"
import { FileImage, FileIcon as FilePdf } from "lucide-react"

export default function CertificateMaker() {
  const [certificateData, setCertificateData] = useState({
    recipientName: "John Doe",
    courseName: "Web Development",
    completionDate: new Date().toISOString().split("T")[0],
    issuerName: "Tech Academy",
    certificateId: "CERT-" + Math.floor(1000 + Math.random() * 9000),
    additionalText: "Successfully completed the course with distinction",
  })

  const [selectedTemplate, setSelectedTemplate] = useState("template1")
  const [customTemplate, setCustomTemplate] = useState<string | null>(null)
  const [signatureImage, setSignatureImage] = useState<string | null>(null)
  const [sealImage, setSealImage] = useState<string | null>(null)
  const [fontStyles, setFontStyles] = useState({
    recipientName: { size: 36, family: "serif", color: "#000000", weight: "bold" },
    courseName: { size: 24, family: "serif", color: "#333333", weight: "normal" },
    completionDate: { size: 16, family: "serif", color: "#555555", weight: "normal" },
    issuerName: { size: 18, family: "serif", color: "#333333", weight: "normal" },
    certificateId: { size: 12, family: "monospace", color: "#777777", weight: "normal" },
    additionalText: { size: 14, family: "serif", color: "#555555", weight: "normal" },
  })

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

  const [positions, setPositions] = useState({ ...defaultPositions })

  const [containerDimensions, setContainerDimensions] = useState({ width: 800, height: 566 })
  const certificateRef = useRef(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setContainerDimensions({ width, height })
      }
    }

    // Initial update
    updateDimensions()

    // Update on window resize
    window.addEventListener("resize", updateDimensions)

    // Update after a short delay to ensure container is fully rendered
    const timeoutId = setTimeout(updateDimensions, 500)

    return () => {
      window.removeEventListener("resize", updateDimensions)
      clearTimeout(timeoutId)
    }
  }, [])

  const handleInputChange = (field: string, value: string | number | Date) => {
    setCertificateData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFontStyleChange = (field: string, property: string, value: any) => {
    setFontStyles((prev) => ({
      ...prev,
      [field]: { ...prev[field as keyof typeof fontStyles], [property]: value },
    }))
  }

  const handlePositionChange = (field: string, position: { x: number; y: number }) => {
    setPositions((prev) => ({
      ...prev,
      [field]: position,
    }))
  }

  const handleResetPositions = () => {
    setPositions({ ...defaultPositions })
  }

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template)
  }

  const handleCustomTemplateUpload = (file: File | null) => {
    if (file === null) {
      setCustomTemplate(null)
      return
    }

    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === "string") {
          setCustomTemplate(e.target.result as string | null)
          setSelectedTemplate("custom")
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSignatureUpload = (file: File | null) => {
    if (file === null) {
      setSignatureImage(null)
      return
    }

    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === "string") {
          setSignatureImage(e.target.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSealUpload = (file: File | null) => {
    if (file === null) {
      setSealImage(null)
      return
    }

    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === "string") {
          setSealImage(e.target.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const downloadAsPNG = async () => {
    if (certificateRef.current) {
      try {
        const dataUrl = await toPng(certificateRef.current, { quality: 1.0 })
        const link = document.createElement("a")
        link.download = `${certificateData.recipientName}-certificate.png`
        link.href = dataUrl
        link.click()
      } catch (error) {
        console.error("Error generating PNG:", error)
      }
    }
  }

  const downloadAsPDF = async () => {
    if (certificateRef.current) {
      try {
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
        pdf.save(`${certificateData.recipientName}-certificate.pdf`)
      } catch (error) {
        console.error("Error generating PDF:", error)
      }
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Certificate Maker</h1>

      <Tabs defaultValue="design" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="customize">Customize</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="batch">Batch Processing</TabsTrigger>
        </TabsList>

        <TabsContent value="design" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Certificate Information</h2>
              <CertificateForm
                certificateData={certificateData}
                onInputChange={handleInputChange}
                onSignatureUpload={handleSignatureUpload}
                onSealUpload={handleSealUpload}
                signatureImage={signatureImage}
                sealImage={sealImage}
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Template Selection</h2>
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onTemplateChange={handleTemplateChange}
                onCustomTemplateUpload={handleCustomTemplateUpload}
                customTemplate={customTemplate}
              />
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
            <div className="border rounded-lg p-4 bg-gray-50" ref={containerRef}>
              <CertificatePreview
                ref={certificateRef}
                certificateData={certificateData}
                selectedTemplate={selectedTemplate}
                customTemplate={customTemplate}
                signatureImage={signatureImage}
                sealImage={sealImage}
                fontStyles={fontStyles}
                positions={positions}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="customize">
          <div className="space-y-6"> 
            <h2 className="text-xl font-semibold mb-4">Customize Certificate</h2>
            <div className="border m-4.5 rounded-lg" ref={containerRef}>
              <CertificateEditor
                certificateData={certificateData}
                selectedTemplate={selectedTemplate}
                customTemplate={customTemplate}
                signatureImage={signatureImage}
                sealImage={sealImage}
                fontStyles={fontStyles}
                positions={positions}
                onFontStyleChange={handleFontStyleChange}
                onPositionChange={handlePositionChange}
                onResetPositions={handleResetPositions}
                containerWidth={containerDimensions.width}
                containerHeight={containerDimensions.height}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <div className="space-y-6">
            <div className="border rounded-lg p-4 bg-gray-50">
              <CertificatePreview
                ref={certificateRef}
                certificateData={certificateData}
                selectedTemplate={selectedTemplate}
                customTemplate={customTemplate}
                signatureImage={signatureImage}
                sealImage={sealImage}
                fontStyles={fontStyles}
                positions={positions}
              />
            </div>

            <div className="flex justify-center gap-4">
              <Button onClick={downloadAsPNG} className="flex items-center gap-2">
                <FileImage size={18} />
                Download as PNG
              </Button>
              <Button onClick={downloadAsPDF} className="flex items-center gap-2">
                <FilePdf size={18} />
                Download as PDF
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="batch">
          <BatchCertificates
            templateId={selectedTemplate}
            customTemplate={customTemplate}
            signatureImage={signatureImage}
            sealImage={sealImage}
            fontStyles={fontStyles}
            positions={positions}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
