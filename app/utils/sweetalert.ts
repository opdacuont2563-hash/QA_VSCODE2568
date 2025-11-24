export type SweetAlertIcon = "success" | "error" | "warning" | "info" | "question";

type SweetAlertOptions = {
  title?: string;
  icon?: SweetAlertIcon;
  timer?: number;
  showConfirmButton?: boolean;
  allowOutsideClick?: boolean;
  background?: string;
  customClass?: { popup?: string };
  didOpen?: () => void;
};

let container: HTMLDivElement | null = null;
let closeTimer: ReturnType<typeof setTimeout> | null = null;

function ensureContainer() {
  if (!container) {
    container = document.createElement("div");
    container.id = "swal-lite";
    document.body.appendChild(container);
  }
  container.innerHTML = "";
  container.className =
    "fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm";
}

function renderPopup(options: SweetAlertOptions) {
  if (!container) return;

  const popup = document.createElement("div");
  popup.className =
    "relative max-w-sm w-[90%] bg-white rounded-2xl shadow-2xl border border-slate-100 px-6 py-5 text-center animate-[fadeIn_0.2s_ease]";
  if (options.background) {
    popup.style.background = options.background;
  }
  if (options.customClass?.popup) {
    popup.className += ` ${options.customClass.popup}`;
  }

  const icon = options.icon ? renderIcon(options.icon) : "";
  popup.innerHTML = `${icon}${options.title ? `<p class="mt-3 text-sm font-semibold text-slate-800">${options.title}</p>` : ""}`;
  container.appendChild(popup);
}

function renderIcon(icon: SweetAlertIcon) {
  const map: Record<SweetAlertIcon, string> = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
    question: "❓",
  };
  return `<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-2xl">${map[icon]}</div>`;
}

const SwalLite = {
  fire(options: SweetAlertOptions) {
    if (typeof window === "undefined") return Promise.resolve();
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    ensureContainer();
    renderPopup(options);
    if (options.didOpen) {
      setTimeout(options.didOpen, 50);
    }
    if (options.timer) {
      closeTimer = setTimeout(() => SwalLite.close(), options.timer);
    }
    return Promise.resolve();
  },
  showLoading() {
    if (!container) return;
    const spinner = document.createElement("div");
    spinner.className = "mt-3 flex justify-center";
    spinner.innerHTML =
      '<div class="h-10 w-10 rounded-full border-4 border-indigo-100 border-t-indigo-500 animate-spin" aria-label="loading"></div>';
    const popup = container.querySelector("div");
    popup?.appendChild(spinner);
  },
  close() {
    if (!container) return;
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    container.remove();
    container = null;
  },
};

export default SwalLite;
