import { forwardRef } from "react"

interface CertificatePreviewProps {
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
}

const CertificatePreview = forwardRef<HTMLDivElement, CertificatePreviewProps>(
  ({ certificateData, selectedTemplate, customTemplate, signatureImage, sealImage, fontStyles, positions }, ref) => {
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
            backgroundImage:
              "linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%)",
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

    // For debugging
    console.log("Certificate Preview Props:", {
      selectedTemplate,
      customTemplate: customTemplate ? "Custom template exists" : "No custom template",
    })

    return (
      <div
        ref={ref}
        className="relative w-full aspect-[1.414/1] rounded-lg overflow-hidden shadow-lg"
        style={{
          ...getTemplateBackground(),
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <div className="absolute w-full h-full border-[12px] border-double border-opacity-30 border-gray-800 rounded-lg pointer-events-none" />

          {/* Certificate Title */}
          <div className="absolute top-[10%] left-0 w-full text-center">
            <h1 className="text-2xl font-bold mb-1">Certificate of Achievement</h1>
            <div className="w-32 h-1 bg-gray-800 mx-auto" />
          </div>

          {/* Recipient Name */}
          <div
            className="absolute"
            style={{
              left: `${positions.recipientName.x}%`,
              top: `${positions.recipientName.y}%`,
              transform: "translate(-50%, -50%)",
              fontSize: `${fontStyles.recipientName.size}px`,
              fontFamily: fontStyles.recipientName.family,
              color: fontStyles.recipientName.color,
              fontWeight: fontStyles.recipientName.weight,
              textAlign: "center",
            }}
          >
            {certificateData.recipientName}
          </div>

          {/* Course Name */}
          <div
            className="absolute"
            style={{
              left: `${positions.courseName.x}%`,
              top: `${positions.courseName.y}%`,
              transform: "translate(-50%, -50%)",
              fontSize: `${fontStyles.courseName.size}px`,
              fontFamily: fontStyles.courseName.family,
              color: fontStyles.courseName.color,
              fontWeight: fontStyles.courseName.weight,
              textAlign: "center",
            }}
          >
            {certificateData.courseName}
          </div>

          {/* Additional Text */}
          <div
            className="absolute"
            style={{
              left: `${positions.additionalText.x}%`,
              top: `${positions.additionalText.y}%`,
              transform: "translate(-50%, -50%)",
              fontSize: `${fontStyles.additionalText.size}px`,
              fontFamily: fontStyles.additionalText.family,
              color: fontStyles.additionalText.color,
              fontWeight: fontStyles.additionalText.weight,
              textAlign: "center",
              maxWidth: "80%",
            }}
          >
            {certificateData.additionalText}
          </div>

          {/* Completion Date */}
          <div
            className="absolute"
            style={{
              left: `${positions.completionDate.x}%`,
              top: `${positions.completionDate.y}%`,
              transform: "translate(-50%, -50%)",
              fontSize: `${fontStyles.completionDate.size}px`,
              fontFamily: fontStyles.completionDate.family,
              color: fontStyles.completionDate.color,
              fontWeight: fontStyles.completionDate.weight,
              textAlign: "center",
            }}
          >
            {formatDate(certificateData.completionDate)}
          </div>

          {/* Issuer Name */}
          <div
            className="absolute"
            style={{
              left: `${positions.issuerName.x}%`,
              top: `${positions.issuerName.y}%`,
              transform: "translate(-50%, -50%)",
              fontSize: `${fontStyles.issuerName.size}px`,
              fontFamily: fontStyles.issuerName.family,
              color: fontStyles.issuerName.color,
              fontWeight: fontStyles.issuerName.weight,
              textAlign: "center",
            }}
          >
            {certificateData.issuerName}
          </div>

          {/* Certificate ID */}
          <div
            className="absolute"
            style={{
              left: `${positions.certificateId.x}%`,
              top: `${positions.certificateId.y}%`,
              transform: "translate(-50%, -50%)",
              fontSize: `${fontStyles.certificateId.size}px`,
              fontFamily: fontStyles.certificateId.family,
              color: fontStyles.certificateId.color,
              fontWeight: fontStyles.certificateId.weight,
              textAlign: "center",
            }}
          >
            ID: {certificateData.certificateId}
          </div>

          {/* Signature */}
          {signatureImage && (
            <div
              className="absolute"
              style={{
                left: `${positions.signature.x}%`,
                top: `${positions.signature.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <img src={signatureImage || "/placeholder.svg"} alt="Signature" className="h-16 object-contain" />
              <div className="w-full h-0.5 bg-gray-800 mt-1" />
              <div className="text-center text-sm mt-1">{certificateData.issuerName}</div>
            </div>
          )}

          {/* Seal */}
          {sealImage && (
            <div
              className="absolute"
              style={{
                left: `${positions.seal.x}%`,
                top: `${positions.seal.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <img src={sealImage || "/placeholder.svg"} alt="Seal" className="h-20 w-20 object-contain" />
            </div>
          )}
        </div>
      </div>
    )
  },
)

CertificatePreview.displayName = "CertificatePreview"

export default CertificatePreview
