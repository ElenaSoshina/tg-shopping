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
    document.documentElement.style.setProperty("--tg-bg-color", colors.bgColor);
    document.documentElement.style.setProperty("--tg-text-color", colors.textColor);
    document.documentElement.style.setProperty("--tg-card-bg", colors.cardBg);
    document.documentElement.style.setProperty("--tg-card-shadow", colors.cardShadow);
    document.documentElement.style.setProperty("--tg-button-color", colors.buttonColor);
    document.documentElement.style.setProperty("--tg-button-text-color", colors.buttonTextColor);

    return colors;
};
