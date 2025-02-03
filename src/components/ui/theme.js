const tg = window.Telegram.WebApp;

export const applyThemeColors = () => {
    const themeColors = tg.themeParams;


    const defaultColors = {
        bg_color: "#ffffff", // Белый фон
        text_color: "#000000", // Черный текст
        button_color: "#0088cc", // Синий цвет кнопки
        button_text_color: "#ffffff", // Белый цвет текста на кнопке
        hint_color: "#4caf50", // Зеленая граница
    }

    // Определение цветов
    const bgColor = themeColors.bg_color || defaultColors.bg_color;
    const textColor = themeColors.text_color || defaultColors.text_color;
    const buttonColor = themeColors.button_color || defaultColors.button_color;
    const buttonTextColor = themeColors.button_text_color || defaultColors.button_text_color;
    const borderColor = themeColors.hint_color || defaultColors.hint_color;

    // Логика проверки контрастности
    const isDarkTheme = bgColor === "#1a1a2e"; // Это пример для определения
    const adjustedSecondaryTextColor = isDarkTheme ? "#f3f3f3" : "#252525";

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
