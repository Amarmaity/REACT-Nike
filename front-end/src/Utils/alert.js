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
