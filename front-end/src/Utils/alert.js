import Swal from "sweetalert2";

export const showSuccess = (message = "Success") => {
  Swal.fire({
    icon: "success",
    title: "Success",
    text: message,
    confirmButtonColor: "#33CCCC",
  });
};

export const showError = (message = "Something went wrong") => {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
    confirmButtonColor: "#e3342f",
  });
};

export const showWarning = (message = "Are you sure?") => {
  Swal.fire({
    icon: "warning",
    title: "Warning",
    text: message,
    confirmButtonColor: "#f59e0b",
  });
};

export const showInfo = (message = "Info") => {
  Swal.fire({
    icon: "info",
    title: "Info",
    text: message,
    confirmButtonColor: "#3b82f6",
  });
};

// -----------------------------
// Toast configuration
// -----------------------------
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

// -----------------------------
// Toast helpers
// -----------------------------

export const showToastSuccess = (message = "Success") => {
  Toast.fire({
    icon: "success",
    title: message,
  });
};

export const showToastError = (message = "Something went wrong") => {
  Toast.fire({
    icon: "error",
    title: message,
  });
};

export const showToastWarning = (message = "Warning") => {
  Toast.fire({
    icon: "warning",
    title: message,
  });
};
export const showToastInfo = (message = "Info") => {
  Toast.fire({
    icon: "info",
    title: message,
  });
};
// ====================
export const confirmAction = async ({
  title = "Are you sure?",
  text = "You won't be able to undo this!",
  confirmText = "Yes",
  cancelText = "Cancel",
  confirmColor = "#e3342f",
}) => {
  return Swal.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: confirmColor,
    cancelButtonColor: "#6b7280",
  });
};