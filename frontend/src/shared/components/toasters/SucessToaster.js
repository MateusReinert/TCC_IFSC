import Swal from "sweetalert2";
import "./Toaster.css";

export function showSucessToast(message) {
  (async () => {
    await Swal.fire({
      toast: true,
      position: "top-end",
      icon: 'success',
      iconColor: 'white',
      title: message, 
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      customClass: {
        popup: "colored-toast",
      },
    });
  })();
}
