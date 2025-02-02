const tg = window.Telegram.WebApp;

export const applyThemeColors = () => {
    const themeColors = tg.themeParams;

    // Определение цветов
    const bgColor = themeColors.bg_color || "#ffffff";
    const textColor = themeColors.text_color || "#000000";
    const buttonColor = themeColors.button_color || "#0088cc";
    const buttonTextColor = themeColors.button_text_color || "#ffffff";
    const borderColor = themeColors.hint_color || "#4caf50";

    // Логика проверки контрастности
    const isDarkTheme = bgColor === "#1a1a2e"; // Это пример для определения
    const adjustedSecondaryTextColor = isDarkTheme ? "#f5f5f5" : "#555";

    // Установка CSS-переменных
    document.documentElement.style.setProperty("--tg-bg-color", bgColor);
    document.documentElement.style.setProperty("--tg-text-color", textColor);
    document.documentElement.style.setProperty("--tg-secondary-text-color", adjustedSecondaryTextColor);
    document.documentElement.style.setProperty("--tg-button-bg", buttonColor);
    document.documentElement.style.setProperty("--tg-button-text", buttonTextColor);
    document.documentElement.style.setProperty("--tg-border-color", borderColor);

    return {
        bgColor,
        textColor,
        adjustedSecondaryTextColor,
        buttonColor,
        buttonTextColor,
        borderColor,
    };
};
