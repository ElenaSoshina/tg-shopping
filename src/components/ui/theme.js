const tg = window.Telegram.WebApp;

// Функция для получения цветов из Telegram API
export const applyThemeColors = () => {
    const themeColors = tg.themeParams;

    const colors = {
        bgColor: themeColors.bg_color || "#ffffff",
        textColor: themeColors.text_color || "#000000",
        cardBg: themeColors.secondary_bg_color || "#f2f4f8",
        cardShadow: "rgba(0, 0, 0, 0.1)",
        buttonColor: themeColors.button_color || "#0088cc",
        buttonTextColor: themeColors.button_text_color || "#ffffff"
    };

    // Устанавливаем CSS-переменные
    document.documentElement.style.setProperty("--tg-bg-color", themeColors.bg_color || "#ffffff");
    document.documentElement.style.setProperty("--tg-text-color", themeColors.text_color || "#000000");
    document.documentElement.style.setProperty("--tg-secondary-text-color", themeColors.secondary_bg_color || "#cccccc");
    document.documentElement.style.setProperty("--tg-button-bg", themeColors.button_color || "#0088cc");
    document.documentElement.style.setProperty("--tg-button-text", themeColors.button_text_color || "#ffffff");
    document.documentElement.style.setProperty("--tg-border-color", themeColors.hint_color || "#4caf50");

    return colors;
};
