module Components.Footer exposing (view)

import Html exposing (Html, a, footer, span, text)
import Html.Attributes exposing (class, href, target, title)


view : Html msg
view =
    footer [ class "bdT ta-c p-30 lh-0 fsz-sm c-grey-600" ]
        [ span []
            [ text "Copyright © 2017 Designed by"
            , a [ href "https://colorlib.com", target "_blank", title "Colorlib" ]
                [ text "Colorlib" ]
            ]
        ]
