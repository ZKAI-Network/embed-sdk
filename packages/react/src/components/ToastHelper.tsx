import { toast, type ToastOptions } from "react-toastify";

type ToastType = "success" | "error";

interface ShowToastProps {
  type?: ToastType;
  message: string;
  title?: string | null;
  options?: ToastOptions;
}

const defaultOptions: ToastOptions = {
  position: "top-center",
  autoClose: 1500,
  style: {
    maxHeight: "75px",
    overflow: "hidden",
    fontSize: "14px",
  },
};

const renderContent = (title: string | null, message: string) => (
  <div>
    {title && <div style={{ fontWeight: 600 }}>{title}</div>}
    <div>{message}</div>
  </div>
);

export const showToast = ({
  type = "success",
  message,
  title = null,
  options = {},
}: ShowToastProps) => {
  const content = renderContent(title, message);

  if (type === "success") {
    toast.success(content, { ...defaultOptions, ...options });
  } else {
    toast.error(content, { ...defaultOptions, ...options });
  }
}; 
