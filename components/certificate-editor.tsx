"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Lock, Unlock, Eye, EyeOff, RotateCcw } from "lucide-react"
import DraggableElement from "./draggable-element"

interface CertificateEditorProps {
  certificateData: {
    recipientName: string
    courseName: string 
    completionDate: string
    issuerName: string
    certificateId: string
    additionalText: string
  }
  selectedTemplate: string
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
  onFontStyleChange: (field: string, property: string, value: any) => void
  onPositionChange: (field: string, position: { x: number; y: number }) => void
  onResetPositions: () => void
  containerWidth: number
  containerHeight: number
}

export default function CertificateEditor({
  certificateData,
  selectedTemplate,
  customTemplate,
  signatureImage,
  sealImage,
  fontStyles,
  positions,
  onFontStyleChange,
  onPositionChange,
  onResetPositions,
  containerWidth,
  containerHeight,
}: CertificateEditorProps) {
  const [selectedElement, setSelectedElement] = useState<string | null>("recipientName")
  const [lockedElements, setLockedElements] = useState<string[]>([])
  const [hiddenElements, setHiddenElements] = useState<string[]>([])

  const getTemplateBackground = () => {
    if (selectedTemplate === "custom" && customTemplate) {
      return {
        backgroundImage: `url(${customTemplate})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    }

    switch (selectedTemplate) {
      case "template1":
        return {
          backgroundImage: "linear-gradient(to right, #f6d365 0%, #fda085 100%)",
        }
      case "template2":
        return {
          backgroundImage: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
        }
      case "template3":
        return {
          backgroundImage: "linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%)",
        }
      default:
        return {
          backgroundImage: "linear-gradient(to right, #f6d365 0%, #fda085 100%)",
        }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handlePositionChange = (id: string, newPosition: { x: number; y: number }) => {
    // Convert absolute position to percentage
    const percentX = (newPosition.x / containerWidth) * 100
    const percentY = (newPosition.y / containerHeight) * 100
    onPositionChange(id, { x: percentX, y: percentY })
  }

  const toggleLock = (elementId: string) => {
    if (lockedElements.includes(elementId)) {
      setLockedElements(lockedElements.filter((id) => id !== elementId))
    } else {
      setLockedElements([...lockedElements, elementId])
    }
  }

  const toggleVisibility = (elementId: string) => {
    if (hiddenElements.includes(elementId)) {
      setHiddenElements(hiddenElements.filter((id) => id !== elementId))
    } else {
      setHiddenElements([...hiddenElements, elementId])
    }
  }

  const getAbsolutePosition = (elementId: string) => {
    const position = positions[elementId]
    if (!position) return { x: 0, y: 0 }

    // Calculate the actual container dimensions to use
    const actualWidth = Math.min(containerWidth, 800) // Match the maxWidth we set
    const actualHeight = actualWidth / 1.414 // Maintain the aspect ratio

    // Convert percentage to absolute position based on actual dimensions
    return {
      x: (position.x * actualWidth) / 100,
      y: (position.y * actualHeight) / 100,
    }
  }

  const elements = [
    {
      id: "recipientName",
      label: "Recipient Name",
      content: certificateData.recipientName,
      style: fontStyles.recipientName,
    },
    {
      id: "courseName",
      label: "Course Name",
      content: certificateData.courseName,
      style: fontStyles.courseName,
    },
    {
      id: "completionDate",
      label: "Completion Date",
      content: formatDate(certificateData.completionDate),
      style: fontStyles.completionDate,
    },
    {
      id: "issuerName",
      label: "Issuer Name",
      content: certificateData.issuerName,
      style: fontStyles.issuerName,
    },
    {
      id: "certificateId",
      label: "Certificate ID",
      content: `ID: ${certificateData.certificateId}`,
      style: fontStyles.certificateId,
    },
    {
      id: "additionalText",
      label: "Additional Text",
      content: certificateData.additionalText,
      style: fontStyles.additionalText,
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full flex items-center justify-center">
        <div
          className="relative w-full aspect-[1.414/1] bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden"
          style={{
            ...getTemplateBackground(),
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >

          {elements.map((element) => (
            <div
              key={element.id}
              className="absolute w-full text-center flex items-center justify-center"
              style={{
                top: `${getAbsolutePosition(element.id).y}px`,
                fontSize: `${element.style.size}px`,
                fontFamily: element.style.family,
                color: element.style.color,
                fontWeight: element.style.weight,
                textAlign: "center",
              }}
            >
              {element.content}
            </div>
          ))}

          {/* Signature */}
          {signatureImage && (
            <div
              className="absolute"
              style={{
                left: `${getAbsolutePosition("signature").x}px`,
                top: `${getAbsolutePosition("signature").y}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <img src={signatureImage} alt="Signature" className="h-16 object-contain" />
              <div className="w-full h-0.5 bg-gray-800 mt-1"></div>
              <div className="text-center text-sm mt-1">{certificateData.issuerName}</div>
            </div>
          )}

          {/* Seal */}
          {sealImage && (
            <div
              className="absolute"
              style={{
                left: `${getAbsolutePosition("seal").x}px`,
                top: `${getAbsolutePosition("seal").y}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <img src={sealImage} alt="Seal" className="h-20 w-20 object-contain" />
            </div>
          )}
        </div>
      </div>

      <div className="w-full">
        <Card>
          <CardContent className="p-4">
            <Tabs defaultValue="elements" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="elements">Elements</TabsTrigger>
                <TabsTrigger value="styles">Styles</TabsTrigger>
              </TabsList>

              <TabsContent value="elements" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Certificate Elements</h3>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {[...elements, { id: "signature", label: "Signature" }, { id: "seal", label: "Seal/Logo" }].map(
                      (element) => (
                        <div
                          key={element.id}
                          className={`flex items-center justify-between p-2 rounded-md ${
                            selectedElement === element.id ? "bg-muted" : ""
                          }`}
                          onClick={() => setSelectedElement(element.id)}
                        >
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleVisibility(element.id)
                              }}
                            >
                              {hiddenElements.includes(element.id) ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <span>{element.label}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleLock(element.id)
                            }}
                          >
                            {lockedElements.includes(element.id) ? (
                              <Lock className="h-4 w-4" />
                            ) : (
                              <Unlock className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">
                    Click on an element to select it, then drag it to reposition.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => setLockedElements([])}
                    >
                      <Unlock className="h-4 w-4" />
                      Unlock All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => setHiddenElements([])}
                    >
                      <Eye className="h-4 w-4" />
                      Show All
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={onResetPositions}>
                      <RotateCcw className="h-4 w-4" />
                      Reset Positions
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="styles" className="space-y-4 mt-4">
                {selectedElement && fontStyles[selectedElement] && (
                  <div className="space-y-4">
                    <h3 className="font-medium">
                      {elements.find((e) => e.id === selectedElement)?.label ||
                        (selectedElement === "signature" ? "Signature" : "Seal/Logo")}{" "}
                      Styles
                    </h3>

                    {fontStyles[selectedElement] && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor="fontSize">Font Size</Label>
                          <div className="flex items-center gap-2">
                            <Slider
                              id="fontSize"
                              min={8}
                              max={72}
                              step={1}
                              value={[fontStyles[selectedElement].size]}
                              onValueChange={(value) => onFontStyleChange(selectedElement, "size", value[0])}
                              className="flex-1"
                            />
                            <span className="w-8 text-center">{fontStyles[selectedElement].size}</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="fontFamily">Font Family</Label>
                          <Select
                            value={fontStyles[selectedElement].family}
                            onValueChange={(value) => onFontStyleChange(selectedElement, "family", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select font family" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="serif">Serif</SelectItem>
                              <SelectItem value="sans-serif">Sans-serif</SelectItem>
                              <SelectItem value="monospace">Monospace</SelectItem>
                              <SelectItem value="cursive">Cursive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="fontWeight">Font Weight</Label>
                          <Select
                            value={fontStyles[selectedElement].weight}
                            onValueChange={(value) => onFontStyleChange(selectedElement, "weight", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select font weight" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="bold">Bold</SelectItem>
                              <SelectItem value="lighter">Light</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="fontColor">Color</Label>
                          <div className="flex gap-2">
                            <div
                              className="w-10 h-10 rounded border"
                              style={{ backgroundColor: fontStyles[selectedElement].color }}
                            />
                            <Input
                              id="fontColor"
                              type="color"
                              value={fontStyles[selectedElement].color}
                              onChange={(e) => onFontStyleChange(selectedElement, "color", e.target.value)}
                              className="w-full h-10"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {(!selectedElement || !fontStyles[selectedElement]) && (
                  <div className="text-center py-8 text-muted-foreground">Select an element to edit its styles</div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
