import React from "react"

const VisuallyHidden = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      border: 0,
      clip: "rect(0 0 0 0)",
      height: "1px",
      margin: "-1px",
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      width: "1px",
      whiteSpace: "nowrap",
      wordWrap: "normal"
    }}
  >
    {children}
  </span>
)

export { VisuallyHidden }
