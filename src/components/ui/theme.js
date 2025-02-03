
export const applyThemeColors = () => {


    const defaultColors = {
        bg_color: "#ffffff", // Белый фон
        text_color: "#000000", // Черный текст
        button_color: "#0088cc", // Синий цвет кнопки
        button_text_color: "#ffffff", // Белый цвет текста на кнопке
        hint_color: "#4caf50", // Зеленая граница
    }

    // Определение цветов
    const bgColor = defaultColors.bg_color;
    const textColor = defaultColors.text_color;
    const buttonColor = defaultColors.button_color;
    const buttonTextColor = defaultColors.button_text_color;
    const borderColor = defaultColors.hint_color;

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
