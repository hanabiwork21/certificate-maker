"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TemplateSelectorProps {
  selectedTemplate: string
  onTemplateChange: (template: string) => void
  onCustomTemplateUpload: (file: File | null) => void
  customTemplate: string | null
}

export default function TemplateSelector({
  selectedTemplate,
  onTemplateChange,
  onCustomTemplateUpload,
  customTemplate,
}: TemplateSelectorProps) {
  const [customTemplatePreview, setCustomTemplatePreview] = useState<string | null>(customTemplate)

  // Update local preview when customTemplate prop changes
  useEffect(() => {
    setCustomTemplatePreview(customTemplate)
  }, [customTemplate])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Reset the input value to allow selecting the same file again
      event.target.value = ""
      onCustomTemplateUpload(file)
    }
  }

  const handleRemoveCustomTemplate = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCustomTemplatePreview(null)
    onTemplateChange("template1")
    onCustomTemplateUpload(null)
  }

  return (
    <div className="space-y-4">
      <RadioGroup
        value={selectedTemplate}
        onValueChange={onTemplateChange}
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
      >
        <div>
          <RadioGroupItem value="template1" id="template1" className="sr-only" />
          <Label htmlFor="template1" className="cursor-pointer">
            <Card className={`overflow-hidden ${selectedTemplate === "template1" ? "ring-2 ring-primary" : ""}`}>
              <div
                className="h-32 w-full"
                style={{
                  background: "linear-gradient(to right, #f6d365 0%, #fda085 100%)",
                }}
              />
              <CardContent className="p-2 text-center">
                <p className="text-sm font-medium">Classic Gold</p>
              </CardContent>
            </Card>
          </Label>
        </div>

        <div>
          <RadioGroupItem value="template2" id="template2" className="sr-only" />
          <Label htmlFor="template2" className="cursor-pointer">
            <Card className={`overflow-hidden ${selectedTemplate === "template2" ? "ring-2 ring-primary" : ""}`}>
              <div
                className="h-32 w-full"
                style={{
                  background: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
                }}
              />
              <CardContent className="p-2 text-center">
                <p className="text-sm font-medium">Blue Sky</p>
              </CardContent>
            </Card>
          </Label>
        </div>

        <div>
          <RadioGroupItem value="template3" id="template3" className="sr-only" />
          <Label htmlFor="template3" className="cursor-pointer">
            <Card className={`overflow-hidden ${selectedTemplate === "template3" ? "ring-2 ring-primary" : ""}`}>
              <div
                className="h-32 w-full"
                style={{
                  background:
                    "linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%)",
                }}
              />
              <CardContent className="p-2 text-center">
                <p className="text-sm font-medium">Colorful Gradient</p>
              </CardContent>
            </Card>
          </Label>
        </div>

        <div>
          <RadioGroupItem value="custom" id="custom" className="sr-only" />
          <Label htmlFor="custom" className="cursor-pointer">
            <Card className={`overflow-hidden ${selectedTemplate === "custom" ? "ring-2 ring-primary" : ""}`}>
              {customTemplatePreview ? (
                <div className="relative">
                  <div
                    className="h-32 w-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${customTemplatePreview})`,
                    }}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={handleRemoveCustomTemplate}
                  >
                    <span className="sr-only">Remove custom template</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </Button>
                </div>
              ) : (
                <div className="h-32 w-full flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <Upload className="h-6 w-6 mx-auto mb-1" />
                    <p className="text-xs">Custom Template</p>
                  </div>
                </div>
              )}
              <CardContent className="p-2 text-center">
                <label htmlFor="customTemplateUpload" className="text-sm font-medium cursor-pointer">
                  {customTemplatePreview ? "Change Custom" : "Upload Custom"}
                </label>
                <input
                  id="customTemplateUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </CardContent>
            </Card>
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}
