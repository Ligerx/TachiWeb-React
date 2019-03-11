// @flow
import type {SchemaType} from "./types/settings-schema";

// The embedded settings schema
// TODO Move the keys and fallbacks into constants and add a function to get the value of a setting or it's fallback
const UI_SETTINGS: SchemaType = [
    {
        "label": "General",
        "icon": "tune",
        "type": "nested",
        "prefs": [
            {
                "label": "Application theme",
                "key": "theme",
                "default": "1",
                "type": "select-single",
                "choices": [
                    {
                        "id": "1",
                        "label": "Main theme"
                    }
                ]
            }
        ]
    },
    {
        "label": "Reader",
        "icon": "chrome_reader_mode",
        "type": "nested",
        "prefs": [
            {
                "label": "Default viewer",
                "type": "select-single",
                "default": "left_to_right",
                "key": "pref_default_viewer_key",
                "choices": [
                    {
                        "id": "left_to_right",
                        "label": "Left to right"
                    },
                    {
                        "id": "right_to_left",
                        "label": "Right to left"
                    },
                    /*{
                      "id": "vertical",
                      "label": "Vertical"
                    },*/
                    {
                      "id": "webtoon",
                      "label": "Webtoon"
                    }
                ]
            },
            {
                "label": "Scale type",
                "type": "select-single",
                "default": "fit_screen",
                "key": "scale_type",
                "choices": [
                    {
                        "id": "fit_screen",
                        "label": "Fit screen"
                    },
                    /*{
                      "id": "stretch",
                      "label": "Stretch"
                    },
                    {
                      "id": "fit_width",
                      "label": "Fit width"
                    },
                    {
                      "id": "fit_height",
                      "label": "Fit height"
                    },
                    {
                      "id": "original",
                      "label": "Original size"
                    },
                    {
                      "id": "smart_fit",
                      "label": "Smart fit"
                    },*/
                ]
            },
            {
                "label": "Zoom start position",
                "type": "select-single",
                "key": "zoom_start_pos",
                "default": "auto",
                "choices": [
                    {
                        "id": "auto",
                        "label": "Automatic"
                    },
                    /*{
                      "id": "left",
                      "label": "Left"
                    },
                    {
                      "id": "right",
                      "label": "Right"
                    },
                    {
                      "id": "center",
                      "label": "Center"
                    }*/
                ]
            },
            {
                "label": "Background color",
                "type": "select-single",
                "default": "white",
                "key": "reader_theme",
                "choices": [
                    {
                        "id": "white",
                        "label": "White"
                    },
                    /*{
                      "id": "black",
                      "label": "Black"
                    }*/
                ]
            },
            {
                "label": "Enable transitions",
                "description": "Play an animation when flipping pages.",
                "default": true,
                "key": "enable_transitions",
                "type": "switch"
            }
        ]
    },
    {
        "label": "Advanced",
        "icon": "code",
        "type": "nested",
        "prefs": []
    },
    {
        "label": "About",
        "icon": "help",
        "type": "nested",
        "prefs": []
    }
]

export default UI_SETTINGS