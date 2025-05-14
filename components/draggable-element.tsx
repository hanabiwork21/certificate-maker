"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Rnd } from "react-rnd"

interface DraggableElementProps {
  id: string
  initialPosition: { x: number; y: number }
  initialSize?: { width: number; height: number }
  onPositionChange: (id: string, position: { x: number; y: number }) => void
  onSizeChange?: (id: string, size: { width: number; height: number }) => void
  children: React.ReactNode
  style?: React.CSSProperties
  bounds?: string
  lockAspectRatio?: boolean
  enableResizing?: boolean
  disableDragging?: boolean
  className?: string
  onClick?: () => void
}

export default function DraggableElement({
  id,
  initialPosition,
  initialSize = { width: 0, height: 0 },
  onPositionChange,
  onSizeChange,
  children,
  style = {},
  bounds = "parent",
  lockAspectRatio = false,
  enableResizing = true,
  disableDragging = false,
  className = "",
  onClick,
}: DraggableElementProps) {
  const [position, setPosition] = useState({
    x: initialPosition.x,
    y: initialPosition.y,
  })
  const [size, setSize] = useState(initialSize)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const prevPositionRef = useRef(initialPosition)
  const prevSizeRef = useRef(initialSize)
  const elementRef = useRef<Rnd>(null)

  // Update position when initialPosition changes
  useEffect(() => {
    if (initialPosition.x !== prevPositionRef.current.x || initialPosition.y !== prevPositionRef.current.y) {
      setPosition(initialPosition)
      prevPositionRef.current = initialPosition

      // Force update the Rnd component position
      if (elementRef.current) {
        elementRef.current.updatePosition({ x: initialPosition.x, y: initialPosition.y })
      }
    }
  }, [initialPosition])

  // Update size when initialSize changes
  useEffect(() => {
    const currentWidth = typeof size.width === "number" ? size.width : size.width
    const currentHeight = typeof size.height === "number" ? size.height : size.height
    const newWidth = typeof initialSize.width === "number" ? initialSize.width : initialSize.width
    const newHeight = typeof initialSize.height === "number" ? initialSize.height : initialSize.height

    if (currentWidth !== newWidth || currentHeight !== newHeight) {
      setSize(initialSize)
      prevSizeRef.current = initialSize

      // Force update the Rnd component size
      if (elementRef.current) {
        elementRef.current.updateSize(initialSize)
      }
    }
  }, [initialSize, size])

  return (
    <Rnd
      ref={elementRef}
      position={position}
      size={size}
      onDragStart={() => setIsDragging(true)}
      onDrag={(e, d) => {
        // Update local state during drag
        setPosition({ x: d.x, y: d.y })
      }}
      onDragStop={(e, d) => {
        setIsDragging(false)
        // Ensure we're using the most accurate position
        const finalPosition = { x: d.x, y: d.y }
        setPosition(finalPosition)
        onPositionChange(id, finalPosition)
      }}
      onResizeStart={() => setIsResizing(true)}
      onResize={(e, direction, ref, delta, position) => {
        // Update local state during resize
        setPosition(position)
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setIsResizing(false)
        const newSize = {
          width: ref.offsetWidth,
          height: ref.offsetHeight,
        }
        setSize(newSize)
        setPosition(position)

        // Notify parent with final values
        onPositionChange(id, position)
        if (onSizeChange) {
          onSizeChange(id, newSize)
        }
      }}
      bounds={bounds}
      lockAspectRatio={lockAspectRatio}
      enableResizing={
        enableResizing
          ? {
              bottom: true,
              bottomLeft: true,
              bottomRight: true,
              left: true,
              right: true,
              top: true,
              topLeft: true,
              topRight: true,
            }
          : false
      }
      disableDragging={disableDragging}
      className={`${className} ${isDragging || isResizing ? "z-50" : "z-10"}`}
      style={{
        ...style,
        cursor: disableDragging ? "default" : "move",
        border: isDragging || isResizing ? "1px dashed #666" : "1px dashed transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClick}
    >
      <div className="w-full h-full flex items-center justify-center">{children}</div>
    </Rnd>
  )
}
