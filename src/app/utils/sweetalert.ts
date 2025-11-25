export type SweetAlertIcon = "success" | "error" | "warning" | "info" | "question";

export type SweetAlertOptions = {
  title?: string;
  text?: string;
  icon?: SweetAlertIcon;
  timer?: number;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  allowOutsideClick?: boolean;
  background?: string;
  customClass?: { popup?: string };
  didOpen?: () => void;
};

export type SweetAlertResult = { isConfirmed: boolean; isDismissed: boolean };

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
  if (!container) return null;

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
  const textBlock = options.text
    ? `<p class="mt-2 text-sm text-slate-600 leading-relaxed">${options.text}</p>`
    : "";
  popup.innerHTML = `${icon}${options.title ? `<p class="mt-3 text-sm font-semibold text-slate-800">${options.title}</p>` : ""}${textBlock}`;
  container.appendChild(popup);
  return popup;
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
  fire(options: SweetAlertOptions): Promise<SweetAlertResult | void> {
    if (typeof window === "undefined") return Promise.resolve();
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    ensureContainer();
    const popup = renderPopup(options);

    if (!popup) return Promise.resolve();

    return new Promise(resolve => {
      if (options.didOpen) {
        setTimeout(options.didOpen, 50);
      }

      if (options.showCancelButton || options.showConfirmButton || options.confirmButtonText || options.cancelButtonText) {
        const actionRow = document.createElement("div");
        actionRow.className = "mt-4 flex items-center justify-center gap-3";

        const createButton = (text: string, type: "confirm" | "cancel") => {
          const btn = document.createElement("button");
          const baseClass =
            "px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2";
          if (type === "confirm") {
            btn.className = `${baseClass} text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500`;
            if (options.confirmButtonColor) {
              btn.style.background = options.confirmButtonColor;
              btn.style.borderColor = options.confirmButtonColor;
            }
          } else {
            btn.className = `${baseClass} text-slate-700 bg-slate-100 hover:bg-slate-200 focus:ring-slate-300`;
          }
          btn.textContent = text;
          return btn;
        };

        if (options.showCancelButton) {
          const cancelBtn = createButton(options.cancelButtonText || "ยกเลิก", "cancel");
          cancelBtn.onclick = () => {
            SwalLite.close();
            resolve({ isConfirmed: false, isDismissed: true });
          };
          actionRow.appendChild(cancelBtn);
        }

        const confirmBtn = createButton(options.confirmButtonText || "ตกลง", "confirm");
        confirmBtn.onclick = () => {
          SwalLite.close();
          resolve({ isConfirmed: true, isDismissed: false });
        };
        actionRow.appendChild(confirmBtn);

        popup.appendChild(actionRow);
      }

      if (options.allowOutsideClick) {
        container?.addEventListener(
          "click",
          e => {
            if (e.target === container) {
              SwalLite.close();
              resolve({ isConfirmed: false, isDismissed: true });
            }
          },
          { once: true }
        );
      }

      if (options.timer) {
        closeTimer = setTimeout(() => {
          SwalLite.close();
          resolve({ isConfirmed: false, isDismissed: true });
        }, options.timer);
      }

      if (!options.showCancelButton && !options.showConfirmButton && !options.confirmButtonText && !options.cancelButtonText && !options.timer) {
        // Non-interactive alert resolves immediately so callers can continue.
        resolve({ isConfirmed: false, isDismissed: true });
      }
    });
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
