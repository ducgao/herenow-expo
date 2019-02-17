import UserRepository from '../repository/user-repository'

export function theme() {
    return UserRepository.instance().getDarkModeEnable() ? dark_theme : light_theme
}

const light_theme = {
    primary_color: "#324b64",
    secondary_color: "#f7f7f9",
    accent_color: "#00afff",
    app_background: "#e7e6ed",
    inactive_color: 'gray',
    link_color: '#3366BB',
    book_button_bg: "#00afff",
    separator_color: "#d0d0d0",
    text_title_color: null,
    text_color: null,
    image_background: 'black',
    button_active: "#00AFFF"
}

const dark_theme = {
    primary_color: "#436586",
    secondary_color: "#f7f7f9",
    accent_color: "#00afff",
    app_background: "#202020",
    inactive_color: 'gray',
    link_color: '#3366BB',
    book_button_bg: "#00afff",
    separator_color: "#d0d0d0",
    text_title_color: "#e7e6ed",
    text_color: "#e7e6ed",
    image_background: '#e7e6ed',
    button_active: "#00AFFF"
}